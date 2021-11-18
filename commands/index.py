import time
import numpy as np
import cv2
import pickle
import json

xml_haar_cascade = "./commands/cascades/data/haarcascade_frontalface_alt2.xml"
eye_cascade = "./commands/cascades/data/haarcascade_eye.xml";

# Carrega o classificador
faceClassifier = cv2.CascadeClassifier(xml_haar_cascade)
eyeClassifier = cv2.CascadeClassifier(eye_cascade);

recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.read('./commands/trainner.yml')

labels = {"person_name": 1}
with open("./commands/labels.pickle",'rb') as f:
    og_labels = pickle.load(f)
    labels = {v:k for k,v in og_labels.items()}

# Iniciar a camera
capture = cv2.VideoCapture(0,cv2.CAP_DSHOW)

capture.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

while not cv2.waitKey(20) & 0xFF == ord("q"):
    ret, frame_color = capture.read()

    gray = cv2.cvtColor(frame_color, cv2.COLOR_BGR2GRAY)
    faces = faceClassifier.detectMultiScale(gray, scaleFactor=1.5, minNeighbors = 5)

    countTests = 0

    for x, y, w, h in faces:
        # salva imagem mais recente do rosto detectado
        roi_gray = gray[y:y+h, x:x+w] # (ycord_start , ycord_end)
        roi_color = frame_color[y:y+h, x:x+w]

        # recognição deep learned model predict keras tensorflow pytorch scikit learn
        id_, conf = recognizer.predict(roi_gray)
        if conf>=45 and conf<= 85:
            # print(id_)
            # print(labels[id_])
            font = cv2.FONT_HERSHEY_SIMPLEX
            name = labels[id_]
            color = (255,255,255)
            stroke = 2
            cv2.putText(frame_color, name, (x,y), font, 1, color, stroke, cv2.LINE_AA)
            
            if(len(labels[id_]) != 0):
                jsonReturn = {'Status':200,'user': labels[id_],'Tentativas': countTests}
                print(json.dumps(jsonReturn))
                cv2.destroyAllWindows()
                exit()

        cv2.rectangle(frame_color, (x,y), (x+w,y+h),(0,255,0), 2 )

        eyes = eyeClassifier.detectMultiScale(roi_gray)
        for (ex,ey,ew,eh) in eyes:
            cv2.rectangle(roi_color,(ex,ey),(ex+ew,ey+eh),(0,255,0),2)
                            
        if countTests == 5:
            jsonReturn = {'Status':404,'Tentativas': countTests}
            print(json.dumps(jsonReturn))
            cv2.destroyAllWindows()
            exit()
            
        countTests += 1

    cv2.imshow('Reconhecimento Facial', frame_color)
