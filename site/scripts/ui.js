/*
 * This class provides the user interface for the character creator
 */
class UserInterface {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.assets = gameEngine.assets;
    }
    
    draw(context) {
        this.assets = gameEngine.assets;
        
        context.fillStyle = "red";
        context.fillRect(0, 0, 1024, 1024);
    }
}
