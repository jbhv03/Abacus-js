//Class represent abacus scene
class Abacus extends Phaser.Scene {

  constructor() {
    super()
  }

  //add all pieces in the abacus
  addPieces() {
    for (let i = 1; i <= 10; i++) {
      const baseValue = 10000000000/(10**i)
      for (let j = 1; j <= 7; j++) {
        if (j <= 2) {
          new Piece(this, this.pieces, i * 90, j * 30 + 50, baseValue*5)
        } else {
          new Piece(this, this.pieces, i * 90, j * 30 + 250, baseValue)
        }
      }
    }
  }

  //reset all pieces positions
  reset() {
    this.pieces.children.iterate(p => {
      p.reset()
    })
  }

  //return the total result with pieces
  getTotal() {
    let res = 0
    this.pieces.children.iterate(p => {
      res += p.getValue()
    })
    return res
  }

  preload() { }

  //create all game object
  async create() {

    //utility function for load base64 image data easily 
    const loadBase64Image = (key, uri) => new Promise(resolve => {
      this.textures.addBase64(key, uri);
      this.textures.once('addtexture', () => resolve());
    });

    //create objects groups
    this.blocks = this.physics.add.group()
    this.pieces = this.physics.add.group()

    //callback collide function 
    function collideCallback(obj1, obj2) {
      if (obj1)
        obj1.body.setGravityY(0)
      obj2.body.setGravityY(0)
      obj1.body.stop()
      obj2.body.stop()
    }
    //setup physics collides between groups 
    this.physics.add.collider(this.blocks, this.pieces, collideCallback)
    this.physics.add.collider(this.pieces, this.pieces, collideCallback)

    //draw the abacus 
    this.add.rectangle(this.scale.width / 2, this.scale.height / 2, 900, 500, 0xffffff)
    for (let i = 1; i <= 10; i++) {
      this.add.line(i * 90, this.scale.height / 2, 0, 0, 0, 500, 0x000000)
    }
    this.blocks.add(this.add.rectangle(500, 25, 900, 50, 0x000000)) //top block
    this.blocks.add(this.add.rectangle(500, 250, 900, 10, 0x000000)) //middle block
    this.blocks.add(this.add.rectangle(500, 575, 900, 50, 0x000000)) //bottom block
    this.blocks.children.iterate(p => p.body.setImmovable())

    this.totalText = this.add.text(600, 0, "0").setAlign('right').setFixedSize(400, 50).setFontSize(50)

    //load, add and setup action buttons
    let fullImageData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgBAMAAAAQtmoLAAAAFVBMVEUAAAD///////////////////////9Iz20EAAAAB3RSTlMAf/86+PL5o95h6gAAANtJREFUeAHt0bEJgkEAQ+GICxw6wQW0VtAJ3EA3cP8hLFL9lXmI3aV/fEW0tvb/Hbzd12Dn7TAhSogSooQoIUqIEqKEKCFKCBAkuMFg/4TB3SwIkFHAPfCugwCnax0EeOUL18Ald7sHFKIHFAIAIQAQAgAhABACACEAEAIAIQAQAgKigBbAgUGBCQF5MECeDJA9eiDBRIAcogQSTALIIVogwQSAHKIGEsweSOBjDSTwOUAfOAALOkAUSBAABg/BYNLAgwSAMCVMCVPClDAlTAlTwpQwJYyJtbVf9wFr63FcmHtO8gAAAABJRU5ErkJggg=="
    let reloadImageData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAADeklEQVR4Ae3BMWiUdxzH4e+RngiXhKYSyH6B0jUKGbMUal1D3M3ookShaYv+Ao7mpmYoZDYedMri6CDZVJBAFjNkEKIx3JBSRCLkUzVG73fve5dX/+/L/16459HAwECxMJUbYCozPjCVF8dMZcUJUznxhamMaGcqHzxT2dDJVC4kmcqENKbyIJ2pXzHOLLe4zxN22KU7U7/hAstskp2pXzDCDbb4eqb4GGOJFt/KFBMVrrBPCFM81NkgjCkeLnNAGFMsVGgQyhQLVdboZY8m17jEJBMS6UyxUOUB3bRYYVoOaUyxUGGNdC9ZoKYEkkzx0CDNIXcZVio6meJhjjTbTKkrPFM81DkgaZ1R9UA7UzxU2CBplSH1xBemmJgnaVWn4oQpM4w55YsxXtNpnSGdimOmzDDgOVXliSU6bTOqDPjAlBnGsavKDyO08A6ZUiaAKTOME6+oKS/cpNOyMsKUGUa7eeWFLbxdhpU7FvEeKR+cp9OCCsCfeEfUlQcaeC1qKgA/8B/eHeWBTbwVFYS/8Z4qHOMc4U2rIPyM946aQjGLt0dFBeE7WngzCsVtvKYKxD94iwrFPbzrKhB/4DUVisd4F1UgfsV7qFDs4E2qQPyE90yh2Mc7pwIxgfdCoXiLd0YF4izeG4XiDd5ZFYgzeG8Vihd4EyoQ5/D2FYpneD+qQEzi7SgUD/F+UYG4iPdYoWji/aYCcR3vnkKxiHdfBaKJd1uhmMHbY0gFocIe3qxCUeMd3owKwjTeEeMKx1O8v1QQVvA2lQfu4P3L9yoANVp4DeWBOkd4v6sALNDpvPLBI7xF5Y5hdvG2lBfmaWfKDFNGLNPppvJCjVecMGWGgTJhikO8FiPKD1c5ZsoM4z1lwCjbdFpSnqjyHDBlhvGRTsUQ63R6zZjyxRymzDA+0alYJWleMWF8pp4YYpWkDSqKB6ONemCUdZIOqCseDEddMcU2aeYUD0YHpWKYuxySpqF4MBKUQI0FXpJujYpiwUghh2lWaNHNA6qKBSOVxASTXOIaTfboZY2qYsEI1aCiWDDCHHBZ8WCE2aCueDBC7HOFimLC+FYtlhhTfBhfb4sbjKhfYGS3yTIX1G8wuttlhyfc5xazjKtfYaRSeWCkUJlgJKhcMDqobDAclQ9GG5URxmcqJ4xPVFYYH6m8MN5TmWGgcsM0MDBQqP8B9Iz7aHoOMkcAAAAASUVORK5CYII="

    await loadBase64Image('reload', reloadImageData)
    this.add.image(25, 25, 'reload')
      .setDisplaySize(50, 50)
      .setInteractive()
      .on('pointerdown', () => {
        this.reset()
      })

    await loadBase64Image('full', fullImageData)
    this.add.image(975, 575, 'full')
      .setDisplaySize(50, 50)
      .setInteractive()
      .on('pointerdown', () => {
        this.scale.startFullscreen()
      })

    this.addPieces()

    this.reset()

  }

  //function used for update scene objects
  update() {
    //refresh counter
    this.totalText.setText(this.getTotal())
  }

}
