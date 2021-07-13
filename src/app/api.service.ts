import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Timeline} from "./timeline";
import {Observable} from "rxjs";
import {Card} from "./card";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = "http://localhost:8080/api/timeline"

  constructor(private http: HttpClient) { }

  getTimelineList(): Observable<Timeline[]> {
    return this.http.get<Timeline[]>(this.baseUrl);
  }

  updateTimeline(timeline: Timeline): Observable<Timeline> {
    return this.http.put<Timeline>(this.baseUrl, timeline);
  }

  deleteTimeline(timelineId: number): Observable<any> {
    return this.http.delete(this.baseUrl + "/" + timelineId);
  }

  getCardListFromTimelineId(timelineId: number) {
    return this.http.get<Card[]>(this.baseUrl + "/" + timelineId + "/card");
  }

  deleteCard(timelineId: number, cardId: number): Observable<any> {
    return this.http.delete(this.baseUrl + "/" + timelineId + "/card/" + cardId);
  }
}
