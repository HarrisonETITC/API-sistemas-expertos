import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GrouperComponent } from '../grouper/grouper.component';
import { CitiesService } from '../../services/cities.service';

@Component({
  selector: 'app-mainpage',
  imports: [
    MatIconModule,
    GrouperComponent
  ],
  providers: [
    CitiesService
  ],
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.css'
})
export class MainpageComponent {

}
