import time
import numpy as np
import cv2
import pickle
import json

# Caminho para os cascades padrões do OpenCV
xml_haar_cascade = "./commands/cascades/data/haarcascade_frontalface_alt2.xml"
eye_cascade = "./commands/cascades/data/haarcascade_eye.xml";

# Carrega o classificador do OpenCV
faceClassifier = cv2.CascadeClassifier(xml_haar_cascade)
eyeClassifier = cv2.CascadeClassifier(eye_cascade);

# Carrega os dados extraídos do trainner.yml que foi gerado pelo Deep Learning
recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.read('./commands/trainner.yml')

labels = {"person_name": 1}
# Abre o arquivo do pickle para pegar os nomes dos usuários que foram registrados
with open("./commands/labels.pickle",'rb') as f:
    og_labels = pickle.load(f)
    labels = {v:k for k,v in og_labels.items()}

# Inicia a camera do usuário
capture = cv2.VideoCapture(0,cv2.CAP_DSHOW)

# Define altura e largura do frame da camera
## Quanto menor, menos processamento por parte do processador
capture.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

# Mantém a camera do usuário aberta
while not cv2.waitKey(20) & 0xFF == ord("q"):
    # Pega as informações da camera do usuario
    ret, frame_color = capture.read()

    # Cria um frame em preto e branco a partir da camera do usuário para identificar
    gray = cv2.cvtColor(frame_color, cv2.COLOR_BGR2GRAY)
    # Detecta o usuário
    faces = faceClassifier.detectMultiScale(gray, scaleFactor=1.5, minNeighbors = 5)

    countTests = 0

    # Pega os dados de localização e tamanho do rosto detectado
    for x, y, w, h in faces:
        # salva imagem mais recente do rosto detectado para aperfeiçoamento futuro do modelo de aplicação
        roi_gray = gray[y:y+h, x:x+w] 
        roi_color = frame_color[y:y+h, x:x+w]

        # Busca os dados do rosto do usuário detectado
        id_, conf = recognizer.predict(roi_gray)
        if conf>=45 and conf<= 85:
            
            # Cria o nome do usuário em cima da câmera para identificação
            font = cv2.FONT_HERSHEY_SIMPLEX
            name = labels[id_]
            color = (255,255,255)
            stroke = 2
            cv2.putText(frame_color, name, (x,y), font, 1, color, stroke, cv2.LINE_AA)
            
            # Caso tenha identificado o usuário de primeira. Retorna um json no print_r que será pego pelo JavaScript.
            # Também fecha a camera e sai do código
            if(len(labels[id_]) != 0):
                jsonReturn = {'Status':200,'user': labels[id_],'Tentativas': countTests}
                print(json.dumps(jsonReturn))
                cv2.destroyAllWindows()
                exit()

        # Cria um retangulo em volta do rosto do usuário
        cv2.rectangle(frame_color, (x,y), (x+w,y+h),(0,255,0), 2 )

        # Identifica os olhos do usuário
        eyes = eyeClassifier.detectMultiScale(roi_gray)
        
        # Busca os dados dos olhos do usuário detectado
        for (ex,ey,ew,eh) in eyes:
            # Cria um retangulo em volta dos olhos do usuário
            cv2.rectangle(roi_color,(ex,ey),(ex+ew,ey+eh),(0,255,0),2)
                            
        # Em último caso. Caso não seja identificado o usuário. é retornado o status: 404 para o front-end
        if countTests == 5:
            jsonReturn = {'Status':404,'Tentativas': countTests}
            print(json.dumps(jsonReturn))
            cv2.destroyAllWindows()
            exit()
            
        countTests += 1

    # Exibe a camera que está sendo detectada para o usuário
    cv2.imshow('Reconhecimento Facial', frame_color)
