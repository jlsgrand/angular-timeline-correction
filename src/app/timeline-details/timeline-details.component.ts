import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../api.service";
import {Timeline} from "../timeline";
import {FormBuilder} from "@angular/forms";
import {Card} from "../card";

@Component({
  selector: 'app-timeline-details',
  templateUrl: './timeline-details.component.html',
  styleUrls: ['./timeline-details.component.css']
})
export class TimelineDetailsComponent implements OnInit {

  // Je déclare mon attribut timeline qui me permettra de voir le timeline édité dans la vue
  timeline: Timeline | undefined;

  // Je crée mon objet JS qui représente le formulaire d'édition de mon timeline
  timelineForm = this.formBuilder.group({
    name: '',
    category: '',
    creationDate: ''
  });

  // Je crée mon objet JS qui représente le formulaire d'édition d'une carte du timeline
  cardForm = this.formBuilder.group({
    name: '',
    date: '',
    imageUrl: '',
    description: ''
  });

  // J'injecte dans mon constructeur, la route, l'api service, le formbuilder
  constructor(private route: ActivatedRoute, private api: ApiService, private formBuilder: FormBuilder) {
  }

  // Quand mon composant est prêt à être affiché
  ngOnInit(): void {
    // Je récupère l'id du timeline qui vient de la route
    const routeParams = this.route.snapshot.paramMap;
    const timelineIdFromRoute = Number(routeParams.get('id'));

    // C'est crado, je récupère toute la liste de l'API pour récupérer seulement un timeline
    // Mais j'ai pas le choix, l'API ne me propose pas de récupérer un timeline juste avec son ID.
    this.api.getTimelineList().subscribe(timelineList => {
      for (const timeline of timelineList) {
        if (timeline.id === timelineIdFromRoute) {
          this.timeline = timeline;

          // Si je trouve mon timeline grâce à son ID,
          // Je remplis les champs du formulaire avec les valeurs de propriétés du Timeline
          this.timelineForm.patchValue({
            name: timeline.name,
            category: timeline.category,
            creationDate: timeline.creationDate
          });
        }
      }
    })
  }

  // Je gère la sauvagarde d'un timeline existant
  onTimelineSave() {
    // Si ma propriété timeline est définie, alors je peux le mettre à jour
    if (this.timeline) {
      // Je récupère les propriétés du timeline qui viennent du formulaire
      this.timeline.name = this.timelineForm.get('name')?.value;
      this.timeline.category = this.timelineForm.get('category')?.value;
      this.timeline.creationDate = this.timelineForm.get('creationDate')?.value;

      // Je sauve le timeline
      this.api.updateTimeline(this.timeline).subscribe(savedTimeline => {
        console.log("le timeline a bien été mis à jour");
        console.log(savedTimeline);
      });
    }
  }

  // Je gère l'événement de clic sur "Editer la carte" ==> je remplis les champs du formulaire "edition formulaire"
  onCardEdit(card: Card) {
    this.cardForm.patchValue({
      name: card.name,
      date: card.date,
      imageUrl: card.imageUrl,
      description: card.description
    });
  }

  // Je gère l'événement de suppression d'une carte
  onCardDelete(id: number, cardIndex: number) {
    // Je reprends l'id du timeline auquel la carte est liée
    const routeParams = this.route.snapshot.paramMap;
    const timelineIdFromRoute = Number(routeParams.get('id'));

    // J'envoie la demande à l'API de supprimer la carte
    this.api.deleteCard(timelineIdFromRoute, id).subscribe(() => {
      console.log("La carte a bien été supprimée");
      // Sur mon objet timeline, j'enlève la carte qui se trouve à l'index cardIndex
      this.timeline?.cardList.splice(cardIndex, 1);
    }, () => console.log("Erreur à la suppression de la carte"));
  }
}
