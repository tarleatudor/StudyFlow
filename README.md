# StudyFlow - Aplicatie web de acordare feedback continuu

# Obiectiv

Realizarea unui prototip web care permite studenților sa ofere feedback continuu (prin emoticoane) in cadrul unei activitati create de profesor. Feedback-ul este anonim si vizibil in timp real.

# Actori principali in aplicatie
- Profesor - creeaza activitati, genereaza coduri, vizualizeaza feedback
- Student - introduce codul si trimite feedback

# Use cases / Cazuri de utilizare
- Profesor
  - poate crea o activitate cu titlu, descriere scurta, durata
  - primeste codul unic generat pentru activitate
  - poate vedea lista activitatilor
  - poate vizualiza feedback-ul peste o activitate sub forma numarului total de emoticoane si prin intermediul unei liste cu timestamp-uri
  - poate vizualiza feedback-ul dupa incheierea activitatii
- Student
  - introduce codul unic primit pentru activitate
  - daca activitatea este valida/activa, intra in interfata de feedback
  - poate trimite oricand reactii sub forma de emoticoane (Smile, Frown, Surprised, Confused) pe durata activitatii
  - reactiile sunt anonime

# Specificatii tehnice. Tehnologii folosite

- aplicatia ruleaza in browser desktop/mobil
- frontend: Single-Page Application (SPA) utilizand React, consuma API-ul prin Axios
- interfete web separate pentru profesor si student
- backend: RESTful API minimal cu Node.js Express, structurat pe module
- ORM (Prisma) + BD relationala (PostgreSQL)
- utilizare WorldTimeAPI ca API extern pentru sincronizarea actorilor in activitate
- deployment in AWS sau Azure

# Fluxul aplicatiei
- Profesor
  - intra pe pagina "Create activity"
  - completeaza campurile si creeaza activitatea
  - primeste un cod unic generat si il distribuie
  - poate vedea feedback-ul pe pagina activitatii intr-o lista de reactii, accesibila si dupa expirarea sesiunii activitatii
- Student
  - intra pe pagina "Join activity"
  - introduce codul primit
  - daca este valid, intra in interfata activitatii
  - poate furniza feedback prin emoticoane de cate ori doreste

# Plan de implementare
- Backend
  - Setup Node.js + Express
  - Configurare ORM
  - Rute REST:
    - POST /activities
    - GET /activities
    - GET /activities/:code
    - POST /feedback
    - GET /activities/:id/feedback
  - Integrare serviciu extern WorldTimeAPI
  - Testare in Postman
  - Deployment la backend
 - Frontend
   - Setup React
   - Pagini
     - Create activity
     - Activity List (profesor)
     - Join Activity
     - Activity Feedback View
     - Conectare cu API
     - Deployment la frontend
 - Testare end to end