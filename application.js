var Game = React.createClass({
  getInitialState: function () {
    return {activeBoard: new Minesweeper.Board(10, 10), over: false, won: false};
  },

  updateGame: function (position, flagging) {
    var tile = this.state.activeBoard.grid[position[0]][position[1]];
    if (flagging) {
      tile.toggleFlag();
    } else {
      tile.explore();
    }

    if(this.state.activeBoard.won() || this.state.activeBoard.lost()){
      this.state.activeBoard.revealAll();
      this.setState({ over: true, won: this.state.activeBoard.won()})
    } else{
      this.forceUpdate();
    }
  },

  restartGame: function () {
    this.setState({activeBoard: new Minesweeper.Board(10, 10), over: false, won: false});
  },

  render: function () {
    var overMessage = this.state.won ? "Congrats, you won!" : "You are a huge loser";
    return(
      <div>
        <Board board={this.state.activeBoard} updateGame={this.updateGame}/>
        <div className={ this.state.over ? "notOver over" : "notOver" }>
          <div>
            {overMessage}
            <br/>
            <button onClick={this.restartGame}>Play again</button>
          </div>
        </div>
      </div>
    );
  }
});

var Board = React.createClass({
  render: function(){
    return(
      <div>{
        this.props.board.grid.map(function(row, rowIdx){
          return(
            <div className="row group">{
              row.map(function (tile, tileIdx) {
                return <Tile tile={tile} updateGame={this.props.updateGame} position={[rowIdx, tileIdx]} key={""+rowIdx+tileIdx}/>
              }.bind(this))
            }</div>
          );
        }.bind(this))
      }</div>
    );
  }
});

var Tile = React.createClass({
  handleClick: function (e) {
    this.props.updateGame(this.props.position, e.altKey);
  },

  render: function(){
    var flagged = this.props.tile.flagged ? " flagged" : "";
    var explored = this.props.tile.explored ? " explored" : "";
    var bombed = this.props.tile.bombed && explored ? " bombed" : "";
    var bombCount =  explored && this.props.tile.adjacentBombCount() || "  ";
    bombCount = bombed ? "☢" : bombCount;
    bombCount = flagged ? "⚑" : bombCount;
    return(
      <div className={"tile"+flagged+explored+bombed} onClick={this.handleClick}>{bombCount}</div>
    );
  }
});

React.render(<Game/>, document.getElementById("game"));
