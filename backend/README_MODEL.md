# Sistema de Predicción AAC - Configuración Final

## 🎯 Modelo Activo

**N-gram con 5-grams + Interpolación Ponderada**

### Accuracy:

- **Top-1:** 17%
- **Top-5:** 40%
- **Top-12:** 54%

### Tamaño:

- Modelo: 1.2 MB
- RAM uso: < 50 MB
- Latencia: < 5ms

---

## 📁 Archivos del Sistema

### **Modelos Activos:**

```
app/models_ml/
└── ngram.pkl (1.2 MB) ✅
```

### **Scripts de Entrenamiento:**

```
scripts/
├── train_ngram.py ✅
├── generate_corpus.py ✅
└── evaluate_model.py ✅
```

### **Predictores:**

```
app/core/
├── ngram_predictor.py ✅
├── ensemble_predictor.py ✅ (usa ngram + fallback)
└── fallback.py ✅
```

### **Datos:**

```
data/
├── aac_corpus.txt (10,116 frases)
├── train.txt (9,103 frases)
└── val.txt (1,012 frases)
```

---

## 🗑️ Archivos Eliminados

**Modelos descartados:**

- ❌ transformer_predictor.py
- ❌ naive_bayes_predictor.py
- ❌ lstm_predictor.py
- ❌ gpt2_predictor.py
- ❌ word2vec_predictor.py

**Scripts descartados:**

- ❌ train_transformer.py
- ❌ train_naive_bayes.py
- ❌ train_lstm.py
- ❌ train_word2vec.py
- ❌ colab_train_transformer\*.py

**Modelos guardados descartados:**

- ❌ lstm_aac.pth
- ❌ naive_bayes.pkl
- ❌ word2vec.model
- ❌ mini_transformer.pth (si existía)

---

## 🚀 Cómo Usar el Sistema

### 1. **Entrenar modelo (si necesitas re-entrenar):**

```bash
python scripts/train_ngram.py
```

### 2. **Evaluar accuracy:**

```bash
python scripts/evaluate_model.py
```

### 3. **Usar en API:**

```python
from app.core.ensemble_predictor import predict_ensemble

predictions = predict_ensemble("yo quiero", num_words=12)
# → ['mi', 'tomar', 'comer', 'estar', 'jugar', ...]
```

---

## ✅ Sistema Limpio y Optimizado

- ✅ Solo archivos necesarios
- ✅ Modelo único optimizado
- ✅ 54% Top-12 accuracy
- ✅ < 2 MB total
- ✅ Listo para producción
