# Trade Manager
The trade manager handles all incoming and outgoing trade offers for you! No need to invite, kick and whisper players manually anymore!

## Features
### Incoming trade offer
When you receive a trade offer whisper, a tile with the name of the item and the price will appear at the bottom of the screen.

For example, 
``@From PlayerABC: Hi, I would like to buy your Saqawal's Nest listed for 3.7 exalted in Standard``

![image](https://user-images.githubusercontent.com/25111613/86523078-e0f5bf80-be34-11ea-9a89-f07ab023e059.png)

Several actions are available: 
- Invite the buyer to your party
- Say "My item is sold" to the buyer (Removes the offer from the overlay).

  For example, ``Sorry, my Saqawal's Nest is already sold.``
  
- Say "I'm busy" to the buyer.

  For example, ``I'm busy right now, I will send you party invite when I'm ready.``
  
- Say "Are you still interested in the my item?" (Usefull if you received trade offers while being AFK).

  For example, ``Are you still interested in my Saqawal's Nest listed for 3.7 exalted?``
  
- Ignore the offer (Removes the trade offer from the overlay)

![image](https://user-images.githubusercontent.com/25111613/86523224-27e4b480-be37-11ea-9e2c-ecf1199d1028.png)

Once you have invited the buyer to your party, the trade offer tile will have a green indicator.

![image](https://user-images.githubusercontent.com/25111613/86523308-78a8dd00-be38-11ea-9306-28ea830ca305.png)

When the buyer join you hideout (or the area you're in), a "User" icon will appear at the bottom right of the trade offer tile.

![image](https://user-images.githubusercontent.com/25111613/86523345-303def00-be39-11ea-9d10-75145f4e85a0.png)

You'll have now, several actions available:
- Send a trade request to the buyer (to engage the trade in-game)
- Invite the buyer to your party (Usefull if the buyer, didn't accept your first party invite quick enough and needs another one.)
- Kick the buyer out of your party (Usefull when the game prevent the buyer from joining your hideout with the "Failed to join instance" bug. You can then Kick the buyer and invite him again quickly)
- Remove the offer (Removes the trade offer from the overlay **and** kick the buyer out of your party)

![image](https://user-images.githubusercontent.com/25111613/86523398-d4279a80-be39-11ea-8af0-c9392eb399df.png)

Once the trade is successful, the buyer will be automatically kicked out of your party and a "Thanks" whisper will be sent to him. (The trade offer is removed from the overlay aswell)

### Item highlight
When you received an **incoming trade offer**, the location of the item will appear on top of the health globe (if available).

![image](https://user-images.githubusercontent.com/25111613/86950661-6cfe3480-c11e-11ea-9ad6-a2cf5e016af2.png)

Once you have opened your stash and selected the right tab, you can click on the "Show" button to highlight the item in the tab.

![image](https://user-images.githubusercontent.com/25111613/86950830-afc00c80-c11e-11ea-9f3b-4ca9d9219e80.png)

There are two highlighting methods available. Both can be customized and enabled/disabled in the settings.

#### In-game highlight
This method is using the in-game search bar to filter the stash tab view. 
##### Pros
 - Simple
 - Use in-game stuff
 
 ##### Cons
 - Doesn't work very well if you have multiple items with the same name in the same stash tab 
(e.g. Primordial Eminence jewels will all have the name "Primordial Eminence", no matter the mods on them. So they'll all be highlighted)

#### Overlay highlight
More advanced and is able to precisely highlight a single item and prevent misslicking on other items.

#### Pros

 - Very intuitive and precise highlight
 - Prevent missclick (only the item that is highlighted can be clicked)
 - Other items are shadowed
#### Cons
 - Require an initial configuration that needs to be done once (if you screen config isn't the one defined by default in the app)
 - Doesn't work if the item location is not provided in the trade offer whisper
#### Initial configuration
You may need to configurate the grid position and size before you can use it for the first time. This is required, because every player have is own screen resolution, size and settings, that we can't always detect with PoE-Overlay.

Start by opening your stash and click on the "Grid" icon at the bottom left of the screen.

![image](https://user-images.githubusercontent.com/25111613/86955475-a25a5080-c125-11ea-870c-fb3e473b8304.png)

You can adjust the grid while trading aswell if you need to, using the "Adjust Grid" button.

![image](https://user-images.githubusercontent.com/25111613/86952429-fb73b580-c120-11ea-9e2c-5553c128c7ca.png)

Adjust the grid approximately using the buttons on each side of the grid.

![image](https://user-images.githubusercontent.com/25111613/86952602-3ece2400-c121-11ea-9990-167f0cf3f02f.png)

When you're done, hit the "Save Grid" button.

### Outgoing trade offers
In progress...

## TODO
- Support Quad tab item highlighting with the overlay highlighting method
- Handle outgoing trade offers
- Play sound effects (buyer join hideout, new trade offer, etc.)
