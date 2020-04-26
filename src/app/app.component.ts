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

  template=[];
  rowProcess=-1;
  colProcess=-1;

  solutions=[];
  SUDOKU_PROBLEM_GRID_MAX_SOLUTION=1;
  isSolveDisabled=false;
  isGeneratingSudokuProblemDisabled=false;
  isStopClicked=false;
  isVisualizationOn = false;

  constructor(){
    this.reset();
  }

  reset(){
    this.gridData = this.generateEmptyGrid();
    this.solutions=[];
    this.done=false;
    this.generateTemplate();
  }

  generateTemplate(){
    this.template=[];
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
      this.generateTemplate();
      this.isStopClicked=false;
      this.isSolveDisabled = true;
      this.done =false;
      this.isVisualizationOn = true;
      this.solutions=[];
      await this.evaluateAndSolve();
      this.rowProcess=-1;
      this.colProcess=-1;
      this.isSolveDisabled = false;
      this.isVisualizationOn = false;
      if(this.solutions && this.solutions!=null && this.solutions.length>0){
        this.gridData=this.solutions[0];
      }
    }

    // method to solve sudoku problem
    async evaluateAndSolve(solutionCount=-1){
      for(let row=0; row < this.GRID_LENGTH; row++){
        for(let col=0; col < this.GRID_LENGTH; col++){
          if(this.gridData[row][col] == 0){
            for(let value=1; value <= this.GRID_LENGTH; value++){
              if(this.isPossible(value, row, col)){
                // console.log(`possible in ${value} in (${row},${col}`);
                this.gridData[row][col]=value;
                await this.onValueChange(row, col);
                await this.evaluateAndSolve(solutionCount);
                if(!this.done){
                  this.gridData[row][col]=0;
                }
              }
            }
            return;
          }
        }
      }

      // this.done=true;
      this.solutions.push(JSON.parse(JSON.stringify(this.gridData)));
      if(this.isStopClicked || this.solutions.length == solutionCount){
        this.done=true;
      }
    }
  
  //to simulate value change for visualization
  async onValueChange(row, col){
    if(this.isVisualizationOn){
      this.rowProcess=row;
      this.colProcess=col;
      await this.sleep(2);
    }
  }

  //allowing only numbers to be input
  onlyNumberKey(event,row, col) {
    // (event.charCode == 8 || event.charCode == 0) ? null : 
    let allowedKeys = (event.which >= 48 && event.which <= 57) || event.which==9;
    if(allowedKeys && event.which!=9){
      setTimeout(()=>{
        this.gridData[row][col]=parseInt(event.key);
      },100)
    }
    return allowedKeys;
  }

  //to pause for ms passed
  sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // utility method to shuffle an array
  shuffle(arr){
    return arr.sort(()=>(Math.random()-0.5));
  }

  // utility method to generate a random number upto maxLimit
  getRandomNumber(maxLimit){
    return Math.floor(Math.random()*maxLimit);
  }

  //if the STOP button is clicked stop finding further solutions
  stopFindingSolutions(){
    this.isStopClicked=true;
  }

  // reconstruct grid by removing the items passed as array in the removedItems array
  // this used for generating a sudoku problem grid.
  reconstruct(grid, removedItems){
    // iterate through removedItems array and remove them from the grid passed
    for(let removeItemIdx=0; removeItemIdx < removedItems.length; removeItemIdx++){
      let removeItem = removedItems[removeItemIdx];
      grid[removeItem.rowIdx][removeItem.colIdx]=0;
    }
    return grid;
  }

  // Method to generate Sudoko Puzzle.
  // Idea is to first generate a random fully qualified sudoku grid 
  // and remove elements one by one and run solving alogrithm to these newly formed grid 
  // if the solving algorthim find solution equal to 'solutionCount' argument passed then collect them.
  // the alogrithm will keep collecting such sudoku grids until all elements in the grid are removed.
  async generateSudokuPuzzle(solutionCount){

    this.isGeneratingSudokuProblemDisabled = true;

    // reset the grid
    this.reset();

    // generate a random fully qualified sudoko grids upto number passed as argument and select any random grid
    // the generated grid will be available in 'gridData'
    await this.generateRandomGrid(this.getRandomNumber(20));

    // array to keep track of removed items.
    let removedItems =[];

    // the randomly generated fully quailified grid is stored as template.
    let gridDataTemplate = JSON.parse(JSON.stringify(this.gridData));

    //form a list of indices with non-zero values. This indices will be used for random selection for removal.
    // at the start all the values would be non-zero, hence the number of element would be equal to number of items in grid.
    let nonZeroIndices = [];
    for (let rowIdx=0; rowIdx<gridDataTemplate.length; rowIdx++){
      let row = gridDataTemplate[rowIdx];
      for(let colIdx=0; colIdx<row.length; colIdx++){
        nonZeroIndices.push([rowIdx,colIdx]);
      }
    }

    // array to accumulate sudoko problem grid with exactly 'solutionCount' solutions.
    let generatedSudokuProblemGrids = [];

    // while there exists elements in nonZeroIndices, run a loop
    while (nonZeroIndices.length>0 || this.isStopClicked){
      // recreate sudoku problem by removing the elements from fully solved sudoku grid
      this.gridData = this.reconstruct(gridDataTemplate, removedItems);

      // select a random element to be removed. The random selection is made from nonZeroIndices array.
      let remRandomIdx = this.getRandomNumber(nonZeroIndices.length);
      let removeItemIdxArr = nonZeroIndices[remRandomIdx];

      let rowIdx = removeItemIdxArr[0];
      let colIdx = removeItemIdxArr[1];
      
      // remove the random selected element from nonZeroIndice as it will be accessed in further flow.
      nonZeroIndices.splice(remRandomIdx,1);

      // record the randomly selected element in removedItem array
      removedItems.push({
        value: this.gridData[rowIdx][colIdx],
        rowIdx,
        colIdx,
      });

      // mark the value of that random element in the grid to 0
      this.gridData[rowIdx][colIdx]=0;

      // freeze the non-zero elements in the array to create a soduko problem grid for algorithm to solve
      this.generateTemplate();

      //solve sudoku and see if there exists solutions one more that the number as passed 'solutionCount'
      await this.evaluateAndSolve(solutionCount+1)

      //if there sudoko problem grid exactly the number of solutions as passed in 'solutionCount', then record the solution
      if(this.solutions && this.solutions.length == solutionCount){
          //clone the sudoku problem grid and record it in 'generatedSudokuProblemGrids'
          let grid = this.reconstruct(gridDataTemplate, removedItems);
          generatedSudokuProblemGrids.push(JSON.parse(JSON.stringify(grid)));
      }else{
        // if solved solution's count doesnt match the 'solutionCount', then reset solution and try again
        this.done = false;
        this.solutions=[];
      }
    }
    // Choose one generated Sudoku problem and render on screen.
    this.gridData = generatedSudokuProblemGrids[generatedSudokuProblemGrids.length-1];
    this.generateTemplate();
    this.isGeneratingSudokuProblemDisabled=false;
  }

  // On an empty grid, run solving algorithm and collect solutions equal to 'maxSolution' count
  // and select a random solution as basis for Sudoku Problem Grid generation
  async generateRandomGrid(maxSolution){
    await this.evaluateAndSolve(maxSolution);
    let randomIdx = this.getRandomNumber(this.solutions.length);
    this.gridData = this.solutions[randomIdx];
  }


}
