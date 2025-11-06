# ml_api.py
from flask import Flask, request, jsonify
import joblib
import re
import spacy

app = Flask(__name__)

# Cargar modelos (asegúrate de que los .pkl están en la misma carpeta)
modelo_tipo = joblib.load("modelo_clasificacion_tramites.pkl")
modelo_prioridad = joblib.load("modelo_priorizacion.pkl")
vectorizer_tipo = joblib.load("vectorizer_tipo.pkl")
vectorizer_prioridad = joblib.load("vectorizer_prioridad.pkl")

nlp = spacy.load("es_core_news_sm")

def limpiar_texto(texto):
    texto = re.sub(r'[^a-zA-ZáéíóúñÁÉÍÓÚÑ\s]', ' ', str(texto))
    doc = nlp(texto.lower())
    tokens = [token.lemma_.strip() for token in doc if token.is_alpha and not token.is_stop and len(token.text) > 2]
    return " ".join(tokens)

@app.route('/predecir', methods=['POST'])
def predecir():
    data = request.get_json()
    texto = data.get('texto', '')
    if not texto:
        return jsonify({"error": "Texto vacío"}), 400

    texto_limpio = limpiar_texto(texto)
    X1 = vectorizer_tipo.transform([texto_limpio])
    X2 = vectorizer_prioridad.transform([texto_limpio])

    tipo = modelo_tipo.predict(X1)[0]
    prioridad = modelo_prioridad.predict(X2)[0]

    return jsonify({"tipo_tramite": tipo, "prioridad": prioridad})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=False)