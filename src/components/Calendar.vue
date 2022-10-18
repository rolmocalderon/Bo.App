<template>
    <div class="calendar">
        <div class="calendar__opts">
            <select class="select" name="calendar__month" id="calendar__month" v-on:change="monthSelected">
                <option v-for="month in months" :key="month" :value="month" :selected="month == actualMonth">{{ month }}</option>>
            </select>

            <select class="select" name="calendar__year" id="calendar__year" v-on:change="yearSelected">
                <option v-for="year in years" :key="year" :value="year" :selected="year == actualYear">{{ year }}</option>
            </select>
        </div>
        <div class="calendar__body">
            <div class="calendar__days">
                <div>L</div>
                <div>M</div>
                <div>X</div>
                <div>J</div>
                <div>V</div>
                <div>S</div>
                <div>D</div>
            </div>

            <div class="calendar__dates">
                <div v-for="day in previousMonthDays" :key="'previousMonth' + day" class="calendar__date calendar__date--grey">
                    <span></span>
                </div>
                <div v-for="day in lastDayOfMonth" :key="day" :productId="getSelectableDateId(day)" class="calendar__date" :class="{ 'calendar__date--grey': !isSelectableDate(day) && selectableDates.length > 0 || isPreviousDay(day), 'selectable':selectableDates.length > 0 && isSelectableDate(day), 'selected': isSelectedDay(day) }" v-on:click="daySelected">
                    <span>{{ day }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as moment from 'moment';
export default {
    name: "calendar",
    props: ["dateSelected", "selectableDates", "actualDay"],
    data: function(){
        return {
            months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            years: Array.from({length: 3}, (v, i) => new Date().getFullYear() + i),
            actualMonth: "",
            actualYear: "",
            previousMonthDays: [],
            lastDayOfMonth: 0,
            selectedDate: this.dateSelected,
            testing: ""
        }
    },
    created: function(){
        let currentDate = "";
        if(this.selectedDate){
            let dateValues = this.selectedDate.split('/');
            currentDate = moment(new Date(dateValues[2], dateValues[1] -1, dateValues[0]));
        }else{
            currentDate = moment(new Date());
        }
        this.setDate(currentDate);
    },
    methods: {
        setDate(incomingDate){
            let currentDate = moment(incomingDate);
            this.lastDayOfMonth = new Date(currentDate.year(), currentDate.month() + 1, 0).getDate();
            let lastDayOfLastMonth = moment(new Date(currentDate.subtract(1,'months').endOf('month').format('YYYY-MM-DD')));
            let previousMonthDays = [lastDayOfLastMonth.date()];
            while(lastDayOfLastMonth.day() < 7 && lastDayOfLastMonth.day() > 1){
                let day = lastDayOfLastMonth.subtract(1, 'day');
                previousMonthDays.push(day.date())
            }
            previousMonthDays.reverse();
            this.actualMonth = this.months[moment(incomingDate).month()];
            this.actualYear = moment(incomingDate).year();
            this.previousMonthDays = previousMonthDays;
        },
        monthSelected(e){
            let selectedPickup = Array.from(e.target.children).find((x) => x.selected);
            let incomingDate = new Date(this.actualYear, this.months.indexOf(selectedPickup.value));
            this.setDate(incomingDate);
        },
        yearSelected(e){
            let selectedPickup = Array.from(e.target.children).find((x) => x.selected);
            let incomingDate = new Date(selectedPickup.value, this.months.indexOf(this.actualMonth));
            this.setDate(incomingDate);
        },
        changeDate(e){
            this.$emit("changeDate", e);
        },
        hideCalendar(e){
            this.$emit("hideCalendar", e);
        },
        isSelectableDate(day){
            let date = this.selectableDates.find(x => x.month - 1 == this.months.indexOf(this.actualMonth) && x.year == this.actualYear && x.day == day);

            return date != undefined ;
        },
		isPreviousDay(day){
			var currentDate = new Date();
			var date = new Date(this.actualYear, this.months.indexOf(this.actualMonth), day);

			return date.getTime() < currentDate.getTime();
		},
        getSelectableDateId(day){
            let date = this.selectableDates.find(x => x.month - 1 == this.months.indexOf(this.actualMonth) && x.year == this.actualYear && x.day == day);
            return date ? date.id : "";
        },
        isSelectedDay(day){
            return this.actualDay === day;
        },
        daySelected(e){
			e.stopPropagation();
			let element = e.target.querySelector('span');
			let daySelected = element.innerHTML;

			let params = {
				'date': new Date(this.actualYear, this.months.indexOf(this.actualMonth), daySelected),
				'id': e.target.getAttribute('productid')
			};
			this.changeDate(params);
			this.hideCalendar();
        }
    }
}
</script>

<style>
.selectable{
    color: #4386c9;
}
.selected{
    border: 1px solid #4386c9;
    color: #4386c9;
}
.calendar {
  --side-padding: 20px;
  --accent-br: 15px;
  box-shadow: 0 0 5px rgb(0 0 0 / 50%);
  width: 100%;
  margin-top: 0.5rem;
}
.calendar select {
  background-color: #f3f4f6;
  padding: 15px 20px;
}
.dates{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.calendar__opts, .calendar__buttons {
  background-color: #fff;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 15px;
}
.calendar__opts {
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
  padding: 20px var(--side-padding);
}
.calendar__body {
  background-image: linear-gradient(to bottom, #f3f4f6, #fff);
}
.calendar__days {
  background-color: #fff;
  padding: 0.5rem;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
.calendar__days > div {
  text-align: center;
  font-weight: 700;
  font-size: 1.02rem;
  color: #c5c8ca;
}
.calendar__dates {
  padding: 0.5rem;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
.calendar__date {
  --height: calc(400px / 6 - var(--side-padding));
  text-align: center;
  height: var(--height);
  line-height: var(--height);
  font-weight: 600;
  font-size: 1.02rem;
  cursor: pointer;
  position: relative;
}
.calendar__date *{
	pointer-events: none;
}
.calendar__date::before {
  content: "";
  position: absolute;
  background-color: rgba(255, 255, 255, 0);
  width: 100%;
  height: calc(var(--height) * 0.9);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: var(--accent-br);
  transition: background-color 0.3s ease;
}
.calendar__date:not(.calendar__date--selected):not(.calendar__date--grey):hover::before {
  background-color: #ededed;
}
.calendar__date--grey {
  color: #c5c8ca;
  cursor: not-allowed;
}
.calendar__date--selected {
  color: #ff374b;
}
.calendar__date--selected::before {
  background-color: #ffeaec;
  border-radius: 0px;
}
.calendar__date--first-date::before {
  border-top-left-radius: var(--accent-br);
  border-bottom-left-radius: var(--accent-br);
}
.calendar__date--last-date::before {
  border-top-right-radius: var(--accent-br);
  border-bottom-right-radius: var(--accent-br);
}
.calendar__date--range-start::after {
  content: "";
  position: absolute;
  bottom: 3px;
  border-radius: 24px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ff374b;
  width: 10px;
  height: 4px;
}
.calendar__date--range-end {
  color: #fff;
}
.calendar__date--range-end::before {
  box-shadow: 0 15px 20px -3px rgba(255, 55, 75, 0.35);
  background-color: #ff374b;
  border-radius: var(--accent-br);
  z-index: 1;
}
.calendar__date--range-end::after {
  content: "";
  position: absolute;
  height: calc(var(--height) * 0.9);
  background-color: #ffeaec;
  width: 50px;
  top: 50%;
  right: 50%;
  transform: translateY(-50%);
}
.calendar__date span {
  position: relative;
  z-index: 1;
}
.calendar__buttons {
  padding: 10px var(--side-padding) 20px;
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}
.calendar__button {
  cursor: pointer;
}
.calendar__button--grey {
  background-color: #f3f4f6;
}
.calendar__button--primary {
  background-color: #1752ff;
  color: #fff;
  transition: box-shadow 0.3s cubic-bezier(0.21, 0.68, 0.09, 0.27), transform 0.2s linear;
}
.calendar__button--primary:hover {
  box-shadow: 0 20px 30px -13px rgba(23, 82, 255, 0.45);
  transform: translateY(-3px);
}
.calendar__button--primary:active {
  box-shadow: 0 10px 10px -6px rgba(23, 82, 255, 0.45);
  transform: translateY(-1px);
}

body {
  display: grid;
  place-items: center;
  background-color: #eaedf2;
  height: 100vh;
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  margin: 3vmin;
}

select,
button {
  font-family: inherit;
  font-weight: 700;
  font-size: 1.02rem;
  outline: none;
  border: 0;
  padding: 15px 20px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.select {
  background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='960px' height='560px' viewBox='0 0 960 560' enable-background='new 0 0 960 560' xml:space='preserve'%3E%3Cg id='Rounded_Rectangle_33_copy_4_1_'%3E%3Cpath d='M480,344.181L268.869,131.889c-15.756-15.859-41.3-15.859-57.054,0c-15.754,15.857-15.754,41.57,0,57.431l237.632,238.937 c8.395,8.451,19.562,12.254,30.553,11.698c10.993,0.556,22.159-3.247,30.555-11.698l237.631-238.937 c15.756-15.86,15.756-41.571,0-57.431s-41.299-15.859-57.051,0L480,344.181z'/%3E%3C/g%3E%3C/svg%3E");
  background-size: 24px;
  background-repeat: no-repeat;
  background-position: calc(100% - var(--side-padding)) center;
}
</style>