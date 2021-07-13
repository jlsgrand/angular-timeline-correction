import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ApiService} from "../api.service";
import {ActivatedRoute} from "@angular/router";
import {Card} from "../card";

@Component({
  selector: 'app-timeline-play',
  templateUrl: './timeline-play.component.html',
  styleUrls: ['./timeline-play.component.css']
})
export class TimelinePlayComponent implements OnInit {

  guessForm = this.formBuilder.group({
    date: ''
  });

  // Je vais avoir besoin de représenter les cartes futures à deviner ==> tableau de cartes
  cardsToGuess: Card[] = [];
  // Je vais avoir besoin de représenter la carte à deviner (en cours) ==> une carte
  guessingCard: Card | undefined;
  // Je vais avoir besoin de représenter les cartes déjà devinées. ==> tableau de cartes
  guessedCards: Card[] = [];

  guessingDate: number = 0;

  clue = '-- ? --';

  constructor(private formBuilder: FormBuilder, private api: ApiService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    // Quand mon composant est prêt
    // J'ai besoin de récupérer l'id du timeline sur lequel je veux jouer pour récupérer ses cartes
    const routeParams = this.route.snapshot.paramMap;
    const timelineIdFromRoute = Number(routeParams.get('id'));

    this.api.getCardListFromTimelineId(timelineIdFromRoute).subscribe(cardListFromApi => {
      this.shuffleArray(cardListFromApi)
      this.cardsToGuess = cardListFromApi;

      this.pickNextCard();
    })
  }

  // Je vais avoir besoin de gérer le submit du formulaire deviner

  // Soit l'année fournie dans le formulaire est ok, je passe à la suivante
  //   Passer à la suivante signifie :
  //     - je prends la carte devinée que je push dans mon tableau des cartes déjà devinées
  //     - je prends une nouvelle carte de celles à deviner (que je supprime dans la liste de celles à deviner)
  //     - je la mets dans la carte à deviner

  // Soit l'année n'est pas bonne, je ne fais rien

  // Si l'année fournie est bonne, comme mon tableau change, je dois le trier par ordre chronologique
  // Je dois aussi vider le formulaire
  guessCard() {
    if (this.guessingCard) {
      const cardDate = new Date(this.guessingCard.date);
      if (cardDate.getFullYear() === this.guessForm.get('date')?.value) {
        // Ici je pousse la carte trouvée dans la liste des cartes trouvées
        this.pickNextCard();
        this.sortArray(this.guessedCards);
      }
    }
  }


  // Fonction pour passer à la carte suivante
  pickNextCard() {
    if (this.guessingCard) {
      this.guessedCards.push(this.guessingCard);
    }

    // Je pioche une nouvelle carte
    this.guessingCard = this.cardsToGuess.pop();

    // Si j'ai encore une carte à deviner je stocke la date pour avoir l'indice
    if (this.guessingCard) {
      this.guessingDate = new Date(this.guessingCard.date).getFullYear();
    }
  }

  // Fonction de "mélangeage" du tableau
  shuffleArray(array: Card[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  // Fonction pour trier les cartes par date croissantes
  sortArray(array: Card[]) {
    array.sort((cardA, cardB) => {
      if (cardA.date < cardB.date) {
        return -1;
      }
      if (cardA.date > cardB.date) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  // Fonction pour afficher l'indice quand la souris passe dessus
  showClue() {
    if (this.guessingCard) {
      this.clue = this.guessingDate.toString();
    }
  }

  // Fonction pour cacher l'indice quand la souris quitte l'élément span
  hideClue() {
    this.clue = '-- ? --';
  }
}
