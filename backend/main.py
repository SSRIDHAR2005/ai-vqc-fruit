from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
import pennylane as qml
from torch import nn
import torchvision.transforms as transforms
import torch.nn.functional as F
import io

# ==============================
# App Initialization
# ==============================

app = FastAPI(title="AI VQC Fruit Quality API")

# Enable CORS (for React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# Model Architecture
# ==============================

class Featurizer(nn.Module):
    def __init__(self, out_dim=4):
        super().__init__()
        self.backbone = nn.Sequential(
            nn.Conv2d(3, 16, 3, 2, 1), nn.ReLU(),
            nn.Conv2d(16, 32, 3, 2, 1), nn.ReLU(),
            nn.Conv2d(32, 64, 3, 2, 1), nn.ReLU(),
            nn.AdaptiveAvgPool2d(1)
        )
        self.head = nn.Linear(64, out_dim)

    def forward(self, x):
        return self.head(self.backbone(x).flatten(1))


n_qubits = 4
dev = qml.device("default.qubit", wires=n_qubits)


@qml.qnode(dev, interface="torch")
def qnode(inputs, weights):
    qml.AngleEmbedding(inputs, wires=range(n_qubits), rotation="Y")
    qml.StronglyEntanglingLayers(weights, wires=range(n_qubits))
    return [qml.expval(qml.PauliZ(i)) for i in range(3)]


weight_shapes = {"weights": (4, n_qubits, 3)}
qlayer = qml.qnn.TorchLayer(qnode, weight_shapes)


class HybridModel(nn.Module):
    def __init__(self):
        super().__init__()
        # IMPORTANT: must match training names
        self.fe = Featurizer()
        self.q = qlayer

    def forward(self, x):
        x = self.fe(x)
        return self.q(x)


# ==============================
# Load Model
# ==============================

checkpoint = torch.load(
    "vqc_fruit_model.pt",
    map_location="cpu",
    weights_only=False  # required for PyTorch 2.6+
)

model = HybridModel()
model.load_state_dict(checkpoint["model_state_dict"])
model.eval()

class_names = checkpoint["class_names"]


# ==============================
# Image Transform
# ==============================

transform = transforms.Compose([
    transforms.Resize((128, 128)),
    transforms.ToTensor()
])


# ==============================
# Routes
# ==============================

@app.get("/")
def root():
    return {"message": "AI VQC Fruit Quality API is running 🚀"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = transform(image).unsqueeze(0)

        with torch.no_grad():
            logits = model(img)

            # 🔥 Temperature Scaling
            temperature = 0.5
            probs = F.softmax(logits / temperature, dim=1).squeeze()

            pred_idx = torch.argmax(probs).item()
            max_conf = probs[pred_idx].item()

        # 🔥 Uncertain fallback
        if max_conf < 0.5:
            prediction = "uncertain"
        else:
            prediction = class_names[pred_idx]

        # 🔥 Return ALL class probabilities
        probabilities = {
            class_names[i]: float(probs[i])
            for i in range(len(class_names))
        }

        return {
            "prediction": prediction,
            "confidence": max_conf,
            "probabilities": probabilities
        }

    except Exception as e:
        return {"error": str(e)}