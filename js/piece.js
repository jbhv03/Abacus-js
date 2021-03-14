function getRandomColor() {
    let h = Math.random()
    return Phaser.Display.Color.HSVToRGB(h, 1, 1).color
  }
  
  // base piece object used in abacus
  class Piece extends Phaser.GameObjects.Ellipse {
  
    constructor(scene, pions, x, y, val) {
      //init super class
      super(scene, x, y, 25, 25, getRandomColor())
      //define internal properties
      this.value = val
      this.default_y = y
      this.pions = pions
      //setup piece
      this.pions.add(this)
      scene.physics.add.existing(this)
      scene.add.existing(this)
      this.setInteractive()
      scene.input.setDraggable(this)
      this.on('drag', this.dragCallback)
      if (this.y > 50 && this.y < 250) {
        this.position = 'top'
        this.min_y = 50
        this.max_y = 245
        this.limit_count = this.min_y + (this.max_y - this.min_y) / 2
      } else {
        this.position = 'bottom'
        this.min_y = 255
        this.max_y = 550
        this.limit_count = this.min_y + (this.max_y - this.min_y) / 2
      }
    }
    
    dragCallback(_pointer, _dragX, dragY) {
      this.y = dragY
      let others_pieces = this.pions.children.getArray().filter(p => p.x == this.x && p.y >= this.min_y && p.y <= this.max_y && p != this)
      for (let p of others_pieces) {
        if (this.default_y > p.default_y && this.y - this.height / 2 < p.y + this.height / 2) {
          this.y = p.y + this.height
        } else if (this.default_y < p.default_y && this.y + this.height / 2 > p.y - this.height / 2) {
          this.y = p.y - this.height
        }
      }
      if (this.y < this.min_y) {
        this.y = this.min_y + this.height / 2
      } else if (this.y > this.max_y) {
        this.y = this.max_y - this.height / 2
      }
    }
  
    reset() {
      this.y = this.default_y
      if (this.position === 'top') {
        this.body.setGravityY(-150)
      } else {
        this.body.setGravityY(150)
      }
    }
  
    getValue() {
      if(this.position == 'top' && this.y < this.limit_count) return 0
      if(this.position == 'bottom' && this.y > this.limit_count) return 0
      return this.value
    }
  
  }
