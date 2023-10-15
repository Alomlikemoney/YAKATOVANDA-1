import { Component, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '../confirmed-data.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-create-annonce',
  templateUrl: './create-annonce.page.html',
  styleUrls: ['./create-annonce.page.scss'],
})
export class CreateAnnoncePage {
  @ViewChild(IonModal)
  modal!: IonModal;
  userEmail: string = '';
  
  // Ajoutez une propriété pour stocker le nom de la collection Firestore
  firestoreCollection: string = 'ANNONCES';
  description: string | undefined;
  phone1: number | undefined;
  phone2: number | undefined;
  phone3: number | undefined;
  statut: string | undefined;
  ville: string | undefined;
  pays: string | undefined;
  quartier: string | undefined;
  referenceAnnexes: string | undefined;
  prix: number | undefined;
  prixStatus: string | undefined;
  dateAnciennete: string | undefined;
  taille: string | undefined;
  referenceAnnexesBien: string | undefined;
  images: File[] = [];
 
  message = 'Commencez à créer votre Annonce.';
  formConfirmed = false;
  confirmedFormDatas: any[] = []; // Liste pour stocker les informations des cartes confirmées
  resetForm: any;
  errorMessage: string='';
  items: Observable<any[]> | undefined;
  route: any;
  afSG: any;

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private newsService: NewsService,
    public afDB: AngularFireDatabase,
  ) {
    // Récupérez l'utilisateur actuellement connecté
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // L'utilisateur est connecté, vous pouvez accéder à son adresse e-mail ici
        const userEmailFromAuth = user.email;
        if (userEmailFromAuth) {
          // Vérifiez que l'adresse e-mail n'est pas null
          this.userEmail = userEmailFromAuth;

          // Vérifiez si userEmail contient une adresse e-mail valide
          if (this.isValidEmail(userEmailFromAuth)) {
            console.log('Adresse e-mail récupérée avec succès :', userEmailFromAuth);
          } else {
            console.error('Adresse e-mail invalide :', userEmailFromAuth);
          }
        }
      } else {
        // L'utilisateur n'est pas connecté, userEmail sera une chaîne vide
        this.userEmail = '';
      }
    });
  }



  // Vérifiez si une chaîne est une adresse e-mail valide
  isValidEmail(email: string): boolean {
    // Utilisez une expression régulière pour valider l'adresse e-mail
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
openModal() {
    if (this.userEmail) {
      this.modal.present();
    } else {
      this.errorMessage = "Vous devez vous connecter ou vous inscrire pour créer une annonce.";
    }
  }
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  async confirm() {
    this.errorMessage = '';
    // Vérifiez uniquement les champs obligatoires
    if (!this.description || !this.phone1 || !this.ville || !this.pays || !this.quartier || !this.prix || !this.dateAnciennete) {
      this.errorMessage = "Veuillez remplir tous les champs obligatoires.";
      return;
    }

// Téléversez les images dans Firebase Storage
  const imageUrls = await this.uploadImages();

    // Créez un objet pour stocker les informations de la carte actuelle
    const formData: any = {
      description: this.description,
      phone1: this.phone1,
      ville: this.ville,
      pays: this.pays,
      quartier: this.quartier,
      prix: this.prix,
      dateAnciennete: this.dateAnciennete,
      userEmail:this.userEmail,
      images: imageUrls, // Ajoutez les liens des images
    };
    // Ajoutez des champs facultatifs s'ils sont remplis
    if (this.phone2) {
      formData['phone2'] = this.phone2;
    }

    if (this.phone3) {
      formData['phone3'] = this.phone3;
    }

    if (this.statut) {
      formData['statut'] = this.statut;
    }

    if (this.referenceAnnexes) {
      formData['referenceAnnexes'] = this.referenceAnnexes;
    }

    if (this.prixStatus) {
      formData['prixStatus'] = this.prixStatus;
    }

    if (this.taille) {
      formData['taille'] = this.taille;
    }

    if (this.referenceAnnexesBien) {
      formData['referenceAnnexesBien'] = this.referenceAnnexesBien;
    }
    // if (this.images.length < 5) {
    //   formData['images'] = this.images;
    // }
    
    //Ajoutez les données confirmées au service Firebase
    this.newsService.addNews(formData);

      // Réinitialisez les valeurs du formulaire après la confirmation
        this.description = '';
        this.phone1 = undefined;
        this.phone2 = undefined;
        this.phone3 = undefined;
        this.statut = '';
        this.ville = '';
        this.pays = '';
        this.quartier = '';
        this.referenceAnnexes = '';
        this.prix = undefined;
        this.prixStatus = '';
        this.dateAnciennete = '';
        this.taille = '';
        this.referenceAnnexesBien = '';
        this.images = [];
        this.formConfirmed = false;
        this.userEmail;
        this.images = [];
        
        this.firestore.collection(this.firestoreCollection).add(formData)
        .then((docRef) => {
          // Succès, le document a été enregistré avec un ID généré automatiquement
          // Stockez également l'ID du document dans l'objet formData
          formData['documentId'] = docRef.id; // Ajoutez cette ligne
          this.confirmedFormDatas.push(formData); // Ajoutez les données à la liste
      
          // Réinitialisez les valeurs du formulaire
          // ...
      
          this.modal.dismiss(formData, 'confirm');
        })
        .catch((error) => {
          console.error("Erreur Firebase :", error);
          // Traitez l'erreur ici, vous pouvez consulter la console pour plus d'informations sur l'erreur Firebase.
        });
      
  }
  

  addImages(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      const files = Array.from(inputElement.files).slice(0, 4);
      this.images = files;
    }
  }

  isValidForm() {
    // Vérifiez si tous les champs obligatoires sont remplis
    return !!this.description && !!this.phone1 && !!this.ville && !!this.pays && !!this.quartier && !!this.prix && !!this.dateAnciennete;
  }


  async uploadImages(): Promise<string[]> {
    const imageUrls: string[] | PromiseLike<string[]> = [];

    for (const image of this.images) {
      const timestamp = new Date().getTime();
      const fileName = `${this.userEmail}_${timestamp}_${image.name}`;
      const filePath = `images/${fileName}`;

      // Téléversez l'image dans Firebase Storage
      const task = this.storage.upload(filePath, image);

      // Attendez la fin de l'envoi
      await task.then(async (snapshot) => {
        if (snapshot.state === 'success') {
          // Récupérez l'URL de téléchargement de l'image
          const downloadURL = await snapshot.ref.getDownloadURL();
          imageUrls.push(downloadURL);
        }
      });
    }

    return imageUrls;
  }
  
  
  // Modifiez la fonction deleteConfirmedForm pour supprimer un document spécifique de Firestore
  // en utilisant son ID, et supprimer l'élément du tableau pour mettre à jour l'interface utilisateur
  deleteConfirmedForm(formData: any) {
    // Vérifiez si formData a un documentId
    if (formData.documentId) {
      // Utilisez le nom de la collection spécifiée
      this.firestore.collection(this.firestoreCollection).doc(formData.documentId).delete()
        .then(() => {
          // Suppression réussie
          const index = this.confirmedFormDatas.findIndex(data => data.documentId === formData.documentId);
          if (index !== -1) {
            // Supprimez l'élément du tableau
            this.confirmedFormDatas.splice(index, 1);
          }
        })
        .catch((error) => {
          console.error("Erreur Firebase :", error);
          // Gérez l'erreur ici
        });
    }
  }
}