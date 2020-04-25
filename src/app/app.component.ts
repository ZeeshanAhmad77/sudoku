import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  gridData = [
    [4,0,0,8,9,7,0,6,0],
    [2,6,0,0,0,0,0,7,0],
    [3,9,0,0,0,6,4,0,8],
    [9,0,1,0,0,8,2,0,0],
    [0,0,3,0,2,4,8,0,9],
    [8,2,0,0,3,9,0,0,7],
    [0,0,4,7,5,0,0,0,3],
    [0,3,9,4,0,0,0,0,0],
    [0,7,2,0,0,0,1,8,0]
  ];

  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 49 && event.charCode <= 57;
  }
}
