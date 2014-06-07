//Jaxson C. Van Doorn, 2014

var playerFunctions = {};

playerFuntions = function(game){};

playerFunctions.prototype = {

    load : function(){

        //Draw Player
        player = game.add.sprite(sav.x, 700, 'playerSprite');
        player.anchor.setTo(0.7, 1);
        player.scale.setTo(4, 4);
        player.smoothed = false;

        //Add Physics
        game.physics.arcade.enable(player);
        
        //Adjust Body Size
        player.body.setSize(40, 30, 30, 0);
        
        //Physics Properties
        player.body.bounce.y = 0;
        player.body.gravity.y = 700;
        player.body.collideWorldBounds = true;

        //Create Group
        playerGroup = game.add.group();
        playerGroup.add(player);

        //Player Animations

        //Walk
        player.animations.add('idle', Phaser.Animation.generateFrameNames('foxIdle', 0, 15, '', 4), 10, true);

        //Idle
        player.animations.add('walking', Phaser.Animation.generateFrameNames('foxRunning', 0, 6, '', 4), 10, true);

        //Jump
        player.animations.add('jumping', Phaser.Animation.generateFrameNames('foxRunning', 0, 0, '', 4), 10, true);
        
        //Crawl
        player.animations.add('crawl', Phaser.Animation.generateFrameNames('foxCrawl', 0, 3, '', 4), 10, true);
        player.animations.add('crawlIdle', Phaser.Animation.generateFrameNames('foxCrawl', 0, 0, '', 4), 10, true);

        //Diging
        player.animations.add('dig', Phaser.Animation.generateFrameNames('foxDig', 0, 17, '', 4), 10, false);
        player.animations.add('digSmall', Phaser.Animation.generateFrameNames('foxDigSmall', 0, 24, '', 4), 13, false);

        //Attack
        player.animations.add('tailWhip', Phaser.Animation.generateFrameNames('foxTail', 0, 12, '', 4), 12, false);

        player.animations.add('flip', Phaser.Animation.generateFrameNames('foxFlip', 0, 9, '', 4), 8, false);
    },

    main : function(){
        
        //Moving
        if (player.isDigging === false && player.killCheck === false)
        {
            //Walk Left
            if (leftButton.isDown)
            {
                player.directX = 80;

                    //Flip When not Attacking
                    if (player.tailWhip === false)
                    {
                        player.scale.x = -4;
                        player.movingRight = false;
                        player.body.offset.x = 35; 
                    }

                    //Above Ground
                    if (player.dig === false)
                    {
                        if (player.tailWhip === false)
                        {
                            player.body.velocity.x = -550;
                        }
                        else
                        {
                            player.body.velocity.x = -350;
                        }

                        if (player.hit === false)
                        {
                            if (player.tailWhip === false)
                            {
                                //Walk Left Animation
                                if (player.body.blocked.down)
                                {
                                    player.animations.play('walking');
                                }

                                //Jump Left Animation
                                else if (player.tailWhip === false)
                                {
                                    player.animations.play('jumping');
                                }
                            }
                        }
                    }

                    //Underground
                    if (player.dig === true)
                    {
                        player.body.velocity.x = -350;
                            
                            //Crawl Left Animation
                            if (player.body.blocked.down)
                            {
                                player.animations.play('crawl');
                            }
                    }
            }

            //Walk Right
            else if (rightButton.isDown)
            {
                player.directX = 190;

                    //Flip When not Attacking
                    if (player.tailWhip === false)
                    {
                        player.scale.x = 4;
                        player.movingRight = true;
                        player.body.offset.x = 30; 
                    }

                    //Above Ground
                    if (player.dig === false)
                    {
                        if (player.tailWhip === false)
                        {
                            player.body.velocity.x = 550;
                        }
                        else
                        {
                            player.body.velocity.x = 350;
                        }
                            
                        if (player.tailWhip === false)
                        {
                            if (player.hit === false)
                            {
                                //Walk Right Animation
                                if (player.body.blocked.down)
                                {
                                    player.animations.play('walking');
                                }

                                //Jump Right Animation
                                else
                                {
                                    player.animations.play('jumping'); 
                                }
                            }
                        }
                    }

                    //Underground
                    if (player.dig === true)
                    {
                        player.body.velocity.x = 350;
                        
                            //Crawl Right Animation
                            if (player.body.blocked.down)
                            {
                                player.animations.play('crawl');
                            }
                    }
            }
        
            //Still
            else if (player.tailWhip === false)
            {
                //Above Ground
                if (player.dig === false)
                {
                    player.animations.play('idle');

                        //Idle Right Animation
                        if (player.movingRight === true)
                        {
                            player.scale.x = 4;
                        }
                        else 
                        {
                            player.scale.x = -4;
                        }
                }

                //Underground
                if (player.dig === true)
                {
                    player.animations.play('crawlIdle');

                        //Idle Right Animation
                        if (player.movingRight === true)
                        {
                            player.scale.x = 4;
                        }
                        else
                        {
                            player.scale.x = -4;  
                        }
                }
            }
        }

        //Jump
        if (jumpButton.isDown && player.tailWhip === false)
        {
            //Single Jump
            if (player.body.blocked.down && player.isDigging === false && player.dig === false && keyDebouncing.spacePressed === false)
            {
                keyDebouncing.spacePressed = true;
                player.body.velocity.y = -450;
            }

            //Double Jump
            if (player.dobuleJump === false && !player.body.blocked.down && keyDebouncing.spacePressed === false)
            {
                keyDebouncing.spacePressed = true;
                player.dobuleJump = true;
                player.body.velocity.y = -450;
            }
        }

        //----------Dig Start----------//

        //Delay Camera Move Until Animation is Done
        if (player.isDigging === true)
        {
            //Tunnel 1
            if (currentTime - digDelay > 1600 && player.layer == 1)
            {
                player.isDigging = false;
                keyDebouncing.downPressed = true;
                keyDebouncing.spacePressed = true;
                topMap.putTileWorldXY(mudTile, player.x, player.y - 100, 128, 128, layerTop);
                player.y = player.y + 256;
                player.dig = true;
            }

            //Tunnel 2
            if (currentTime - digDelay > 1800 && player.layer == 2)
            {
                player.isDigging = false;
                keyDebouncing.downPressed = true;
                keyDebouncing.spacePressed = true;
                player.y = player.y + 128;
            }  
        }

        //Digging Animations
        if (player.isDigging === true)
        {
            //To Tunnel 1
            if (player.layer == 1)
            {
                player.animations.play('dig');
            }

            //To Tunnel 2
            if (player.layer == 2)
            {
                player.animations.play('digSmall');
            }

            //Dig Right Animation
            if (player.movingRight === true)
            {
                player.scale.x = 4;
            }
            else 
            {
                player.scale.x = -4;
            }  
        }

        //Down
        if (downButton.isDown && player.body.blocked.down && !player.isDigging === true && player.layer < 3 && player.tailWhip === false && playerFunctions.prototype.tileBelow() && keyDebouncing.downPressed === false)
        {
            if (player.layer < 2 && playerFunctions.prototype.onTile())
            {
                playerFunctions.prototype.digDown();
            }
            else if (player.layer > 1)
            {
                playerFunctions.prototype.digDown();
            }
        }

        //Up
        if (jumpButton.isDown && player.isDigging === false && playerFunctions.prototype.tileAbove() && keyDebouncing.spacePressed === false)
        {
            if (player.layer == 2)
            {
                keyDebouncing.spacePressed = true;
                player.y = player.y - 260;
                
                chapter1.prototype.killLevel();
                player.dig = false;
            }

            if (player.layer == 3)
            {
                keyDebouncing.spacePressed = true;
                player.y = player.y - 128;
            }
        }
        
        //----------Dig End----------//

        //Reset Double Jump Varible
        if (player.body.blocked.down)
        {
            player.dobuleJump = false;
        }
        else
        {
            player.dig = false;
        }

        //Stop the anmation
        if (player.body.blocked.right || player.body.blocked.left)
        {
            //player.hit = true;
            player.animations.stop();
            player.tailWhip = false;
        }


        //Tail Whip
        if (attackButton.isDown && player.isDigging === false && player.dig === false && player.body.blocked.down && keyDebouncing.attackPressed === false)
        {
            keyDebouncing.attackPressed = true;
            player.tailWhip = true;
            player.tailWhipJump = true;
        }
        if (player.tailWhip === true)
        {
            player.animations.play('tailWhip');
            keyDebouncing.spacePressed = true;

                if (player.movingRight === true)
                {
                    player.body.offset.x = 75;
                }
                else
                {
                    player.body.offset.x = -10;
                }
                
                if (player.animations.currentFrame.index == 81)
                {
                    player.tailWhip = false;

                    if (player.movingRight === true)
                    {
                        player.body.offset.x = 30;
                    }
                    else
                    {
                        player.body.offset.x = 35;
                    }
                }
        }

        //Kill Animation
        if (player.killCheck === true && player.killAnim === false)
        {
            player.killAnim = true;
            player.animations.play('flip');
        }

        //Kill Once Animation Done
        if (player.animations.currentAnim.isFinished === true && player.killCheck === true)
        {
            playerFunctions.prototype.kill();
        }
    },

    varibleSet : function(){
        
        mudTile = 51;
        player.x = sav.x;
        player.y = 1022;
        player.movingRight = true;
        player.dig = false;
        player.isDigging = false;
        player.dobuleJump = false;
        player.tailWhip = false;
        player.hit = false;
        player.killCheck = false;
        player.killAnim = false;
        digDelay = null;
    },

    digDown : function(){

        mudTile = 49;
        playerFunctions.prototype.digDelayFunc();
        playerFunctions.prototype.onTile();
    },

    digDelayFunc : function(){

        digDelay = game.time.now;
        player.isDigging = true;
    },

    onTile : function() {
        
        if (player.movingRight === true)
        {
            player.onTile = topMap.getTileWorldXY(player.x - 100, player.y);
        }
        else 
        {
            player.onTile = topMap.getTileWorldXY(player.x - 100, player.y);
        }

        if (player.onTile === null)
        {
            return false;
        }
        else
        {
            return true;
        }
    },

    objectsLayer : function(){
        
        if (!player.body.blocked.left && !player.body.blocked.right)
        {
            player.layer = 0;
            player.body.velocity.x = 0;
        }
    },

    topLayer : function(){
        
        player.layer = 1;
        player.dig = false;
        player.body.velocity.x = 0;
    },

    tunnel1 : function(){

        player.layer = 2;
        tunnel1.fill(51, layerTunnel1.getTileX(player.x - player.directX), layerTunnel1.getTileY(player.y - 128), 3, 1);
    },

    tunnel2 : function(){

        player.layer = 3;
        tunnel2.fill(51, layerTunnel2.getTileX(player.x - player.directX), layerTunnel2.getTileY(player.y - 128), 3, 1);
    },

    tileAbove : function() {

        if (player.layer == 3)
        {
            player.tileAbove = objectsMap.getTileWorldXY(player.x, player.y - 129);   
        }
        else if (player.layer == 2)
        {
            player.tileAbove = objectsMap.getTileWorldXY(player.x, player.y - 257);   
        }

        if (player.tileAbove === null)
        {
            return true;
        }
        else
        {
            return false;
        }
    },

    tileBelow : function() {

        if (player.layer == 2)
        {
            player.tileBelow = objectsMap.getTileWorldXY(player.x, player.y);   
        }
        else if (player.layer == 1)
        {
            player.tileBelow = objectsMap.getTileWorldXY(player.x, player.y + 129);   
        }

        if (player.tileBelow === null)
        {
            return true;
        }
        else
        {
            return false;
        }
    },

    kill : function(){

        //Enemy
        croc1.destroy();
        croc1Functions.prototype.load();

        //Player
        playerFunctions.prototype.varibleSet();

        //Tree
        treeGroup.destroy();
        tree.prototype.load();

        //Level
        chapter1.prototype.killLevel();

        croc1.parent.bringToTop(croc1);
        player.bringToTop();
        treeGroup.parent.bringToTop(treeGroup);
    }
};

//Jaxson C. Van Doorn, 2014
