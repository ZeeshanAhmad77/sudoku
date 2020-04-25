import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  COUNT = 0;
  GRID_SIZE=3;

  GRID_LENGTH = this.GRID_SIZE * this.GRID_SIZE;
  done: boolean=false;
  gridData = [
    [0,0,6,8,0,2,0,0,5],
    [0,0,0,0,3,0,7,0,0],
    [0,0,0,0,0,0,8,2,4],
    [1,0,0,4,8,0,0,0,0],
    [0,9,0,0,0,0,0,0,0],
    [0,3,0,0,1,0,2,5,0],
    [4,5,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,6,0],
    [0,0,0,1,7,0,0,3,0]
  ];

  // gridData = [
  //   [0,0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0,0]
  // ];

  template=[];
  rowProcess=-1;
  colProcess=-1;

  isSolveDisabled=false;

  constructor(){
    // this.gridData = this.generateEmptyGrid();

    for(let y=0; y < this.GRID_LENGTH; y++){
      this.template[y]=[];
      for(let x=0; x < this.GRID_LENGTH; x++){
        this.template[y][x]=this.gridData[y][x] == 0?0:1;
      }
    }
  }

  //generate empty grid
  generateEmptyGrid(){
    let grid=[];
    for(let y=0; y < this.GRID_LENGTH; y++){
      grid[y]=[];
      for(let x=0; x < this.GRID_LENGTH; x++){
        grid[y][x]=0;
      }
    }
    return grid;
  }

  //check if a given value is ok to be placed in row
  checkIfPossibleRowWise(value, rowIdx){
    let isPossible = true;

    //for each column in a row
    for(let cellIdx=0; cellIdx < this.gridData[rowIdx].length; cellIdx++) {
      if(this.gridData[rowIdx][cellIdx] == value){
        isPossible = false;
        break;
      }
    }
    return isPossible;
  }

    //check if a given value is ok to be placed in column
    checkIfPossibleColumnWise(value, colIdx){
      let isPossible = true;

      let noOfRows = this.GRID_LENGTH;
      // for each row
      for(let rowIdx=0; rowIdx < noOfRows; rowIdx++) {
        //check same column
        if(this.gridData[rowIdx][colIdx] == value){
          isPossible = false;
          break;
        }
      }
      return isPossible;
    }

    //check if a given value is ok to be placed in grid
    checkIfPossibleGridWise(value, colIdx, rowIdx){
      let isPossible = true;
      let gridStartColIdx = Math.floor(colIdx / this.GRID_SIZE) * (this.GRID_SIZE);
      let gridStartRowIdx = Math.floor(rowIdx / this.GRID_SIZE) * (this.GRID_SIZE);

      /***********************/ 
      /*   GRID INDEX  3x3   */
      /***********************/
      /** 0,0 ** 0,3 ** 0,6 **/
      /** 3,0 ** 3,3 ** 3,6 **/
      /** 6,0 ** 6,3 ** 6,6 **/
      /***********************/

      for (let row=gridStartRowIdx; row < (gridStartRowIdx + this.GRID_SIZE); row++){
        for (let col=gridStartColIdx; col < (gridStartColIdx + this.GRID_SIZE); col++){
          // console.log(value, row, col);
          if(this.gridData[row][col] == value){
            isPossible = false;
          }
        }
      }
      return isPossible;
    }

    // Check if a give value passed here is ok to be placed in position rowIdx, colIdx
    isPossible(value, rowIdx, colIdx){
      if( this.checkIfPossibleRowWise(value, rowIdx) &&
          this.checkIfPossibleColumnWise(value, colIdx) &&
          this.checkIfPossibleGridWise(value, colIdx, rowIdx)){
            return true;
      }else{
        return false;
      }
    }

    async solveSudoku(){
      this.isSolveDisabled = true;
      this.done =false;
      await this.evaluateAndSolve();
      this.rowProcess=-1;
      this.colProcess=-1;
      this.isSolveDisabled = false;
    }

    // method to solve sudoku problem
    async evaluateAndSolve(){
      for(let row=0; row < this.GRID_LENGTH; row++){
        for(let col=0; col < this.GRID_LENGTH; col++){
          if(this.gridData[row][col] == 0){
            for(let value=1; value <= this.GRID_LENGTH; value++){
              if(this.isPossible(value, row, col)){
                // console.log(`possible in ${value} in (${row},${col}`);
                this.gridData[row][col]=value;
                await this.onValueChange(row, col);
                await this.evaluateAndSolve();
                if(!this.done){
                  this.gridData[row][col]=0;
                }
              }
            }
            return;
          }
        }
      }

      this.done=true;
    }
  
  async onValueChange(row, col){
    this.rowProcess=row;
    this.colProcess=col;
    await this.sleep(5);
  }

  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 49 && event.charCode <= 57;
  }

  sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
