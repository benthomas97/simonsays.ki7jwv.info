
var app = new Vue({
  el: '#app',
  data: {
    possible_entries: ['red', 'yellow', 'green', 'blue'],
    computed_pattern: [],
    user_pattern: [],
		scores: [],
    myMessage: 'Good luck!',
    currentSignal: 'gray',
    roundNum: 0,
    showingSignal: false,

		name: 'ANON',
  },

  created() {
    this.newGame();
  },

  methods: {

    sleep(millis)
    {
			var date = new Date();
			var curDate = null;

			do { curDate = new Date(); }
			while(curDate-date < millis);
    },
    async getScores() {
      try {
        let response = await axios.get("/api/scores");
        this.scores = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async uploadScore() {
      try {
        let r1 = await axios.post('/api/scores', {
          name: this.name,
          score: this.roundNum
        });
        console.log('Uploaded new score');
      } catch (error) {
        console.log(error);
      }
    },

    addToPattern()
    {
	this.roundNum++;
	var next = this.possible_entries[Math.floor(Math.random() * Math.floor(4))];
	this.computed_pattern.push(next);
    },

    changeSignal(color, time)
    {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
	  this.currentSignal = color;
        }, time);
      });
    },

    async displayPattern()
    {
			this.showingPattern = true;
			for(index = 0; index < this.computed_pattern.length; index++)
			{
				await this.changeSignal(this.computed_pattern[index], 1000);
				await this.changeSignal('gray', 500);
			}
			this.showingPattern = false;
			this.myMessage = 'Good luck!';
    },

    newGame()
    {
			this.getScores();
			this.computed_pattern = [];
			this.user_pattern = [];
			this.myMessage = 'Good luck!';
			this.roundNum = 0;
			this.addToPattern();
			this.displayPattern();
    },

    checkGame()
    {
	var lostGame = false;
	for(var i = 0; i < this.user_pattern.length; i++)
	{
		if(this.user_pattern[i] != this.computed_pattern[i])
		{
			lostGame = true;
			break;
		}
	}
	if(lostGame)
	{
		this.uploadScore();
		this.newGame();
		this.myMessage = 'You lose! Restarting game.';
	}
	if(!lostGame && this.user_pattern.length === this.computed_pattern.length)
	{
		this.user_pattern = [];
		this.addToPattern();
		this.displayPattern();
	}
    },

    displayRules()
    {
	alert('Rules:\n1. Enter the pattern you see flashed.\n2. Each round, the pattern will get longer.\n3. If you try to enter the pattern while it plays, the game will restart.');
    },

    addColor(color)
    {
	if(this.showingPattern === true)
	{
		this.newGame();
	}
	else
	{
		this.user_pattern.push(color);
		this.checkGame();
	}
    },

  }

});
