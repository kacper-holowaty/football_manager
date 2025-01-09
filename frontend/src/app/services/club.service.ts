import { Injectable } from '@angular/core';
import { Club } from '../models/club.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClubService {
  private apiUrl = "http://localhost:3000/clubs"

  constructor(private httpClient: HttpClient) {}

  addClub(club: Club): Observable<Club> {
    const formData = new FormData();

    formData.append("clubId", club.clubId);
    formData.append("name", club.name);
    formData.append("foundedYear", club.foundedYear.toString());
    formData.append("stadiumName", club.stadiumName);
    formData.append("stadiumCapacity", club.stadiumCapacity.toString());
    formData.append("ownerId", club.ownerId);

    formData.append("address[street]", club.address.street);
    formData.append("address[houseNumber]", club.address.houseNumber);
    if (club.address.apartmentNumber) {
      formData.append("address[apartmentNumber]", club.address.apartmentNumber);
    }
    formData.append("address[postalCode]", club.address.postalCode);
    formData.append("address[city]", club.address.city);
    formData.append("address[country]", club.address.country);

    club.achievements.forEach((achievement, index) => {
      formData.append(`achievements[${index}][name]`, achievement.name);
      formData.append(
        `achievements[${index}][date]`,
        new Date(achievement.date).toISOString()
      );
      formData.append(
        `achievements[${index}][description]`,
        achievement.description
      );
    });

    if (club.badge) {
      formData.append("badge", club.badge);
    }
    
    return this.httpClient.post<Club>(this.apiUrl, formData);
  }

  getClubById(clubId: string): Observable<Club> {
    console.log(clubId);
    return this.httpClient.get<Club>(`${this.apiUrl}/${clubId}`);
  }
}
