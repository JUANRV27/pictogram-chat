"""
Script de evaluación de accuracy del ensemble completo.
Mide Top-1, Top-5 y Top-12 accuracy en frases del conjunto de validación.
"""

import sys
sys.path.append('.')

from app.core.ensemble_predictor import predict_ensemble
from pathlib import Path
import json
import random

def evaluar_accuracy(num_tests=100):
    """Evalúa el accuracy del modelo ensemble"""
    
    # Cargar conjunto de validación
    val_file = Path("data/val.txt")
    with open(val_file, 'r', encoding='utf-8') as f:
        val_sentences = [line.strip() for line in f if line.strip()]
    
    print(f"📊 Evaluando con {num_tests} frases del conjunto de validación...")
    print(f"Total frases disponibles: {len(val_sentences)}\n")
    
    # Seleccionar muestra aleatoria
    test_sentences = random.sample(val_sentences, min(num_tests, len(val_sentences)))
    
    # Métricas
    top1_correct = 0
    top5_correct = 0
    top12_correct = 0
    total = 0
    
    print("Ejemplos de predicciones:\n")
    
    for i, sentence in enumerate(test_sentences):
        words = sentence.split()
        
        # Necesitamos al menos 2 palabras (contexto + target)
        if len(words) < 2:
            continue
        
        # Usar las primeras N-1 palabras como contexto
        context_words = words[:-1]
        target_word = words[-1]
        
        context_str = " ".join(context_words)
        
        # Predecir
        try:
            predictions = predict_ensemble(context_str, num_words=12)
        except:
            continue
        
        # Verificar si target está en predicciones
        if target_word in predictions[:1]:
            top1_correct += 1
        if target_word in predictions[:5]:
            top5_correct += 1
        if target_word in predictions[:12]:
            top12_correct += 1
        
        total += 1
        
        # Mostrar algunos ejemplos
        if i < 10:
            match = "✅" if target_word in predictions[:12] else "❌"
            print(f"{match} '{context_str}' → '{target_word}'")
            print(f"   Predicciones: {predictions[:5]}...")
            print()
    
    # Calcular accuracies
    acc_top1 = (top1_correct / total * 100) if total > 0 else 0
    acc_top5 = (top5_correct / total * 100) if total > 0 else 0
    acc_top12 = (top12_correct / total * 100) if total > 0 else 0
    
    # Resultados
    print("\n" + "="*60)
    print("📈 RESULTADOS DE EVALUACIÓN")
    print("="*60)
    print(f"Frases evaluadas: {total}")
    print()
    print(f"Top-1 Accuracy:  {acc_top1:.1f}% ({top1_correct}/{total})")
    print(f"Top-5 Accuracy:  {acc_top5:.1f}% ({top5_correct}/{total})")
    print(f"Top-12 Accuracy: {acc_top12:.1f}% ({top12_correct}/{total})")
    print("="*60)
    
    # Interpretación
    print("\n📊 Interpretación:")
    if acc_top12 >= 85:
        print("✅ EXCELENTE - Supera el objetivo de 85%")
    elif acc_top12 >= 75:
        print("✅ BUENO - Rendimiento sólido para AAC")
    elif acc_top12 >= 60:
        print("⚠️  ACEPTABLE - Funcional pero mejorable")
    else:
        print("❌ BAJO - Necesita más entrenamiento o datos")
    
    # Guardar resultados
    results = {
        "total_evaluated": total,
        "top1_accuracy": acc_top1,
        "top5_accuracy": acc_top5,
        "top12_accuracy": acc_top12,
        "timestamp": str(Path("data/val.txt").stat().st_mtime)
    }
    
    with open("app/models_ml/evaluation_results.json", 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n💾 Resultados guardados en: app/models_ml/evaluation_results.json")
    
    return acc_top1, acc_top5, acc_top12

if __name__ == "__main__":
    print("🔍 Evaluación del Sistema AAC Ensemble\n")
    evaluar_accuracy(num_tests=100)
