
//饮料
class beverage{
	constructor(){
		this.descrition = "Unknow Beverage"
	}
	
	cost(){
		throw new Error("该方法必须被重写!")
	}
}

//黑咖啡
class espresso extends beverage{
	constructor(){
		super()
		this.descrition = "Espresso"
	}

	cost(){
		return 10
	}
}

//家常咖啡
class houseBlend extends beverage{
	constructor(){
		super()
		this.descrition = "HouseBlend"
	}
	cost(){
		return 8
	}
}

//配料装饰器
class CondimentDecorator extends beverage{
	constructor(){
		super()
	}
}

class mocha extends CondimentDecorator{
	constructor(beverage){
		super()
		this.beverage = beverage
		this.descrition = beverage.descrition + ",mocha"
	}

	cost(){
		return 3.5 + this.beverage.cost()
	}
}
console.log( new beverage().descrition)
console.log( new houseBlend().descrition)

var o = new mocha(new mocha(new espresso()))
console.log( o.descrition, o.cost())