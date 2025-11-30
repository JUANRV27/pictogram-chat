# Paso a paso para entrenar modelos AAC

## 1. Generar corpus (5 minutos)

```bash
cd backend
python scripts/generate_corpus.py
```

**Output esperado:**

- `data/aac_corpus.txt` - 10k+ frases
- `data/train.txt` - 90% entrenamiento
- `data/val.txt` - 10% validación
- `data/vocab.txt` - Vocabulario único

---

## 2. Entrenar N-gram (10 minutos, CPU)

```bash
python scripts/train_ngram.py
```

**Output:**

- `app/models_ml/ngram.pkl` (~15 MB)
- Accuracy estimado: 70-75% Top-12

---

## 3. Entrenar Word2Vec (45 minutos, CPU)

```bash
python scripts/train_word2vec.py
```

**Output:**

- `app/models_ml/word2vec.model` (~15 MB)
- Accuracy estimado: 60-70% Top-12

---

## 4. Entrenar Mini-Transformer (2-3 horas, GPU recomendado)

### Opción A: Google Colab (RECOMENDADO - GPU gratis)

1. Sube `backend/` a Google Drive
2. Abre Google Colab: https://colab.research.google.com
3. Conecta tu Drive:

```python
from google.colab import drive
drive.mount('/content/drive')
%cd /content/drive/MyDrive/pictogram-chat/backend
```

4. Activa GPU: Runtime → Change runtime type → GPU (T4)

5. Instala dependencias:

```bash
!pip install torch gensim
```

6. Entrena:

```bash
!python scripts/train_transformer.py
```

### Opción B: Local CPU (MUY LENTO - 8-12 horas)

```bash
# Solo si tienes paciencia o GPU local
python scripts/train_transformer.py
```

**Output:**

- `app/models_ml/mini_transformer.pth` (~35 MB)
- `app/models_ml/vocab.json` (~50 KB)
- Accuracy estimado: 75-85% Top-12

---

## 5. Verificar que todo esté listo

```bash
ls app/models_ml/
```

**Debe mostrar:**

- ngram.pkl
- word2vec.model
- mini_transformer.pth
- vocab.json

**Tamaño total:** ~65 MB

---

## 6. Probar sistema completo

```bash
# Instalar dependencias
pip install -r requirements.txt

# Iniciar backend
uvicorn app.main:app --reload
```

**Probar endpoint:**
http://localhost:8000/docs → `/recommend`

```json
{
  "selected": ["yo", "quiero"]
}
```

---

## Notas importantes

- ⏱️ **Tiempo total:** ~4-5 horas (mayoría es Transformer en GPU)
- 💾 **Espacio:** ~65 MB modelos + ~50 MB corpus
- 🚀 **Performance:** Primera inferencia lenta, luego ~100-200ms
- 📊 **Accuracy esperado:** 85-90% Top-12 (ensemble)

---

## Troubleshooting

**"No module named 'gensim'":**

```bash
pip install gensim
```

**"CUDA out of memory" en Colab:**
→ Reduce batch_size en train_transformer.py (línea 185): `batch_size=16`

**Transformer muy lento en CPU:**
→ Es normal, considera usar Colab con GPU gratis
