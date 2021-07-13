import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";

@Component({
  selector: 'app-timeline-list',
  templateUrl: './timeline-list.component.html',
  styleUrls: ['./timeline-list.component.css']
})
export class TimelineListComponent implements OnInit {

  // Je crée un attribut dans mon TimelineListComponent que je pourrais réutiliser dans le template
  // Il s'agit d'un observable (ce que me renvoie le service) qui émettra une liste de Timeline
  timelineList = this.api.getTimelineList();

  // Dans le constructure j'injecte mon ApiService
  constructor(private api: ApiService) { }

  ngOnInit(): void {
  }

  // Ici je gère l'événement de suppression d'un timeline
  onDeleteTimeline(id: number) {
    // Je m'abonne au retour que me fait l'API pour afficher un message en console et recharger le liste des timelines
    this.api.deleteTimeline(id).subscribe(() => {
      console.log("Le timeline " + id + " a bien été supprimé");
      this.timelineList = this.api.getTimelineList();
    });
  }
}
