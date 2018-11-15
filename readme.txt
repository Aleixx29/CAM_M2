Claveau Alexandre
Prémel-Cabic

Navigateurs : Chrome Version 70.0.3538.102,
              Firefox 63.0.1

Comment lancer le projet sur son poste : 
    * Si vous avez docker alors :
        - utiliser un terminal
        - lancer la commande de build : docker build -t camm2
        - Lancer la commande afin de run le conatiner : docker run --rm -it -p 8080:80 camm2
    * Si vous n'avez pas docker :
        - Mettre les fichiers à la racine d'un serveur web
        ou
        - Lancer le fichier index.hmtl (Attention : Certaines fonctionnalitées risque de ne pas fonctionner en fonction de votre navigateur)

Utilisation du site :
- Vous arrivez sur une page d'accueil
- Vous pouvez cliquer sur le bouton "Let's go to take pictures" ou "camera"
- Vous arrivez sur la page de la caméra
- Il faut accepter le partage d'accès de la caméra et de votre géolocalisation
- Vous pouvez ensuite prendre un photo en cliquant sur "Shoot"
- Vous allez avoir vos informations qui vont s'afficher (latitude, longitude, date)
- Vous pouvez ensuite enregistrer votre photo en cliquant sur "Save"
- Si vous le souhaiter vous pouvez cliquer sur "Gray Scale" afin d'avoir un filtre gris sur la photo
- Enfin, vous pouvez cliquer sur "Reset" afin de retrouver la caméra

Axe d'amélioration du projet :
- Rendre disable les boutons "Save", "Reset", "GrayScale" tant que la photo n'est pas prise
