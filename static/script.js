var gridSize = {
  "min_x": 0,
  "max_x": 10,
  "min_y": 0,
  "max_y": 10
};

var typeOfCase = {
  "empty":              0,
  "player_spy"  :       1,
  "player_scout":       2,
  "player_miner":       3,
  "player_sergeant":    4,
  "player_lieuteant":   5,
  "player_captain":     6,
  "player_major":       7,
  "player_colonel":     8,
  "player_general":     9,
  "player_marshal":     10,
  "player_bomb":        11,
  "player_flag":        12,
  "block":              13,
  "opponent_spy"  :     14,
  "opponent_scout":     15,
  "opponent_miner":     16,
  "opponent_sergeant":  17,
  "opponent_lieuteant": 18,
  "opponent_captain":   19,
  "opponent_major":     20,
  "opponent_colonel":   21,
  "opponent_general":   22,
  "opponent_marshal":   23,
  "opponent_bomb":      24,
  "opponent_flag":      25
};

function possible_deplacement(value, x, y) {
  "use strict";
  // We can deplace empty case, bomb, flag, block and opponent pieces
  if (
    value    == typeOfCase.empty
    || value == typeOfCase.bomb
    || value == typeOfCase.flag
    || value >= typeOfCase.block
  ) {
    return null;
  }
  var deplacements = [];
  var inc = 1;
  while(y - inc >= gridSize.min_y) {
    var top_id = "piece_" + (y - inc) + "_" + x;
    if (value != typeOfCase.player_scout) {
      if (parseInt(document.getElementById(top_id).dataset.value) == typeOfCase.empty) {
        deplacements.push(top_id);
      }
      break;
    }
    if (parseInt(document.getElementById(top_id).dataset.value) != typeOfCase.empty) {
      break;
    }
    deplacements.push(top_id);
    inc++;
  }
  inc = 1;
  while(y + inc < gridSize.max_y) {
    var bottom_id = "piece_" + (y + inc) + "_" + x;
    if (value != typeOfCase.player_scout) {
      if (parseInt(document.getElementById(bottom_id).dataset.value) == typeOfCase.empty) {
        deplacements.push(bottom_id);
      }
      break;
    }
    if (parseInt(document.getElementById(bottom_id).dataset.value) != typeOfCase.empty) {
      break;
    }
    deplacements.push(bottom_id);
    inc++;
  }
  inc = 1;
  while(x - inc >= gridSize.min_x) {
    var left_id = "piece_" + y + "_" + (x - inc);
    if (value != typeOfCase.player_scout) {
      if (parseInt(document.getElementById(left_id).dataset.value) == typeOfCase.empty) {
        deplacements.push(left_id);
      }
      break;
    }
    if (parseInt(document.getElementById(left_id).dataset.value) != typeOfCase.empty) {
      break;
    }
    deplacements.push(left_id);
    inc++;
  }
  inc = 1;
  while(x + inc < gridSize.max_x) {
    var right_id = "piece_" + y + "_" + (x + inc);
    if (value != typeOfCase.player_scout) {
      if (parseInt(document.getElementById(right_id).dataset.value) == typeOfCase.empty) {
        deplacements.push(right_id);
      }
      break;
    }
    if (parseInt(document.getElementById(right_id).dataset.value) != typeOfCase.empty) {
      break;
    }
    deplacements.push(right_id);
    inc++;
  }
  return deplacements;
}

function potential_attack(piece_mouvements) {
  "use strict";
  var p_attacks = [];
  for (var mvt in piece_mouvements) {
    var element = document.getElementById(piece_mouvements[mvt]);
    var x       = element.cellIndex;
    var y       = element.parentElement.rowIndex;
    if (y - 1 > gridSize.min_y) {
      var top_id = "piece_" + (y - 1) + "_" + x;
      var top = document.getElementById(top_id);
      var top_value = parseInt(top.dataset.value);
      if(top_value >= typeOfCase["opponent_spy"]) {
        p_attacks.push(top_id);
      }
    }
    if (x - 1 > gridSize.min_x) {
      var left_id = "piece_" + y + "_" + (x - 1);
      var left = document.getElementById(left_id);
      var left_value = parseInt(left.dataset.value);
      if(left_value >= typeOfCase["opponent_spy"]) {
        p_attacks.push(left_id);
      }
    }
    if (x + 1 < gridSize.max_x) {
      var right_id = "piece_" + y + "_" + (x + 1);
      var right = document.getElementById(right_id);
      var right_value = parseInt(right.dataset.value);
      if(right_value >= typeOfCase["opponent_spy"]) {
        p_attacks.push(right_id);
      }
    }
    if (y + 1 < gridSize.max_y) {
      var bottom_id = "piece_" + (y + 1) + "_" + x;
      var bottom = document.getElementById(bottom_id);
      var bottom_value = parseInt(bottom.dataset.value);
      if(bottom_value >= typeOfCase["opponent_spy"]) {
        p_attacks.push(bottom_id);
      }
    }
  }
  return p_attacks;
}

var grid = new Vue({
  el: "#grid",
  data: {
    piece:             null,
    piece_mouvements : null,
    potential_attacks: null,
    rows: [
      [0, 0, 0,  0,  0, 0, 0,  0,  0, 0],
      [0, 0, 0,  0,  24, 0, 0,  0,  0, 0],
      [0, 0, 0,  14,  0, 14, 0,  0,  0, 0],
      [0, 0, 0,  0,  0, 0, 0,  0,  0, 0],
      [0, 0, 13, 13, 0, 0, 13, 13, 0, 0],
      [14, 0, 13, 13, 0, 0, 13, 13, 0, 0],
      [0, 0, 0,  0,  2, 1, 0,  0,  0, 0],
      [14, 0, 0,  0,  0, 0, 0,  0,  0, 0],
      [0, 0, 0,  0,  8, 0, 0,  0,  0, 0],
      [0, 0, 0,  0,  0, 0, 0,  0,  0, 0]
    ]
  },
  methods: {
    create: function(event) {
      "use strict";
      this.rows = [
        [11, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

        [0, 0, 11, 11, 0, 0, 11, 11, 0, 0],
        [0, 0, 11, 11, 0, 0, 11, 11, 0, 0],

        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ];
      console.log("paf");
    },
    user_play: function(cord_x, cord_y, new_cord_x, new_cord_y, attack) {
      "use strict";
      var buffer = msgpack.encode({
        cord_x     : cord_x,
        cord_y     : cord_y,
        new_cord_x : new_cord_x,
        new_cord_y : new_cord_y,
        attack     : attack
      });
      var self = this;
      axios.post(
        '/deplacement', buffer,
        {
          headers: {'Content-Type': 'application/msgpack'}
        }
      ).then(function(response) {
        console.log("deplacement");
        console.log(response);
        self.ia_play();
      });
    },
    ia_play: function(event) {
      "use strict";
      console.log('ok');
    },
    select_or_deplace: function(event) {
      "use strict";
      var piece    = event.target;
      if (this.piece == piece) {
        return;
      }
      var x        = piece.cellIndex;
      var y        = piece.parentElement.rowIndex;
      var value    = parseInt(piece.dataset.value);
      if (this.piece != null) {
        this.piece.classList.remove("selected");
      }
      if (piece.classList.contains('possible')) {
        this.user_play(this.piece.cellIndex, this.piece.parentElement.rowIndex, x, y, false);
      }
      else {
        // clear possible
        for (var mvt in this.piece_mouvements) {
          document.getElementById(this.piece_mouvements[mvt]).classList.remove("possible");
        }
        this.piece_mouvements = possible_deplacement(value, x, y);
        for (var mvt in this.piece_mouvements) {
          document.getElementById(this.piece_mouvements[mvt]).classList.add("possible");
        }
        for (var p in this.potential_attacks) {
          document.getElementById(this.potential_attacks[p]).classList.remove("potential_attack");
        }
        this.potential_attacks = potential_attack(this.piece_mouvements);
        for (var p in this.potential_attacks) {
          document.getElementById(this.potential_attacks[p]).classList.add("potential_attack");
        }
        if (this.piece_mouvements != null)
        {
          piece.classList.add("selected");
        }
        this.piece = piece;
      }
    }
  }
});