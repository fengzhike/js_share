//鸭子
class duck {
	constructor(){

	}
	fly(){
		throw new Error("该方法必须被重写!");
	}
	quack(){
		throw new Error("该方法必须被重写!");
	}
}

//火鸡
class turkey {
	constructor(){
		
	}
	fly(){
		throw new Error("该方法必须被重写!");
	}
	gobble(){
		throw new Error("该方法必须被重写!");
	}
}

class mallardDuck extends duck {
	constructor(){
		super()
	}
	fly(){
		console.log("可以飞翔很长的距离!");
	}
	quack(){
		console.log("嘎嘎！嘎嘎！");
	}
}

class wildTurkey extends turkey{
	constructor(){
		super()
	}
	fly(){
		console.log("飞翔的距离貌似有点短!");
	}
	gobble(){
		console.log("咯咯！咯咯！");
	}
}

//火鸡冒充鸭子
class turkeyAdapter extends duck {
	constructor(turKeyInstance){
		super()
		this.t = turKeyInstance
	}
	fly(){
	    for(var i=0; i<5; i ++){
	        this.t.fly();
	    }
	}
	quack(){
		this.t.gobble()
	}
}

var turkeyAdaptee = new turkeyAdapter(new wildTurkey())
turkeyAdaptee.fly()
turkeyAdaptee.quack()