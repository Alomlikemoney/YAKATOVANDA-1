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
import { ModalController } from '@ionic/angular';
import { LoginPagePage } from '../login-page/login-page.page';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { SharedService } from '../shared.service';
import { AnnonceService } from '../annonce-service.service';
import { v4 as uuidv4 } from 'uuid';

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
  Nomvendeur: string | undefined;
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
  localAnnouncements: any[] = [];

  message = 'Commencez à créer votre Annonce.';
  formConfirmed = false;
  confirmedFormDatas: any[] = []; // Liste pour stocker les informations des cartes confirmées
  resetForm: any;
  errorMessage: string = '';
  items: Observable<any[]> | undefined;
  route: any;
  afSG: any;
  userImageUrls: string | undefined;

  constructor(
    private storage: Storage,
    private firestore: AngularFirestore,
    private firestorage: AngularFireStorage,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private newsService: NewsService,
    public afDB: AngularFireDatabase,
    private modalController: ModalController,
    private alertController: AlertController,
    private router: Router,
    private sharedService: SharedService,
    private annonceService: AnnonceService
  ) {
    // Récupérez l'utilisateur actuellement connecté
    this.afAuth.authState.subscribe((user) => {
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

  ngOnInit() {
    // ...
    this.storage.create();
      // Chargement des données stockées localement
  this.storage.get('localAnnouncements').then((data) => {
    if (data) {
      this.localAnnouncements = data;
    }
  })
  }
  
  // Vérifiez si une chaîne est une adresse e-mail valide
  isValidEmail(email: string): boolean {
    // Utilisez une expression régulière pour valider l'adresse e-mail
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  async openModal() {
    if (this.userEmail) {
      this.modal.present();
    } else {
      this.router.navigate(['/tabs/login-page']);
    }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  async confirm() {
    this.errorMessage = '';
    // Vérifiez uniquement les champs obligatoires
    if (!this.description || !this.phone1 || !this.ville || !this.pays || !this.quartier || !this.prix || !this.dateAnciennete) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    // Supposons que tu aies stocké l'adresse e-mail de l'utilisateur dans userEmail
    this.firestore
      .collection('users', (ref) => ref.where('phoneOrEmail', '==', this.userEmail))
      .valueChanges()
      .subscribe((userData: any[]) => {
        if (userData.length > 0) {
          // userData contient les informations de l'utilisateur, y compris les URLs des images de profil
          // Assure-toi que tu stockes ces URLs dans une variable pour les afficher plus tard dans le template
          this.userImageUrls = userData[0].imageUrls;
          // formData.userImageUrls = this.userImageUrls;
        }
      });

    // Téléversez les images dans Firebase Storage
    const imageUrls = await this.uploadImages();

    // Générez un ID unique pour cette annonce
    const cardId = uuidv4();
  // Stockez cet ID unique dans l'objet formData
 
    // Créez un objet pour stocker les informations de la carte actuelle
    const formData: any = {
      id: cardId, // Utilisez l'ID généré
      Nomvendeur: this.Nomvendeur,
      description: this.description,
      phone1: this.phone1,
      ville: this.ville,
      pays: this.pays,
      quartier: this.quartier,
      prix: this.prix,
      dateAnciennete: this.dateAnciennete,
      userEmail: this.userEmail,
      userImageUrls: this.userImageUrls,
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
   
    
    // Ajoutez les données confirmées au service Firebase
    this.newsService.addNews(formData);
// Ajoutez l'annonce à la liste locale
this.localAnnouncements.push(formData);

// Sauvegardez les données localement
this.storage.set('localAnnouncements', this.localAnnouncements).then(() => {
  console.log('Annonce sauvegardée localement.');
});

    // Ajoutez les données confirmées au service
    this.annonceService.addConfirmedFormData(formData, cardId); // Passez formData et cardId

    // Sauvegardez les données de l'annonce en local
    this.storage.get('annonces').then((annonces: any[]) => {
      if (!annonces) {
        annonces = [];
      }
      annonces.push(formData); // Ajoutez l'annonce à la liste locale

      this.storage.set('annonces', annonces).then(() => {
        console.log('Annonce sauvegardée en local.');
      });

      // Fermez le modal
      this.modalController.dismiss();

      // Réinitialisez les valeurs du formulaire après la confirmation
      this.Nomvendeur = '';
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
    });


    formData['documentId'] = cardId;

    this.firestore
      .collection(this.firestoreCollection)
      .add(formData)
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
        console.error('Erreur Firebase :', error);
        // Traitez l'erreur ici, vous pouvez consulter la console pour plus d'informations sur l'erreur Firebase.
      });

    // Fonction appelée lorsqu'une ion-card est sélectionnée
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
      const task = this.firestorage.upload(filePath, image);

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
  deleteConfirmedForm(formData: any) {
    // Vérifiez si formData a un documentId
    if (formData.documentId) {
      // Utilisez le nom de la collection spécifiée
      this.firestore
        .collection(this.firestoreCollection)
        .doc(formData.documentId)
        .delete()
        .then(() => {
          // Suppression réussie
          const index = this.confirmedFormDatas.findIndex((data) => data.documentId === formData.documentId);
          if (index !== -1) {
            // Supprimez l'élément du tableau
            this.confirmedFormDatas.splice(index, 1);
          }
            // Supprimez également l'élément du tableau des données stockées localement
        const localIndex = this.localAnnouncements.findIndex((localData) => localData.documentId === formData.documentId);
        if (localIndex !== -1) {
          this.localAnnouncements.splice(localIndex, 1);
        }
        })

           // Supprimez l'annonce du stockage local
    this.storage.get('localAnnouncements').then((data) => {
      if (data) {
        const filteredData = data.filter((localData: any) => localData.documentId !== formData.documentId);
        this.storage.set('localAnnouncements', filteredData).then(() => {
          console.log('Annonce locale supprimée avec succès.');
        });
      }
    });
        // Supprimez également l'élément du DOM
        const elementToRemove = document.querySelector(`.annonce[data-id="${formData.documentId}"]`);
        if (elementToRemove) {
          elementToRemove.remove();
        }
      }
      
  }
      
    }
 