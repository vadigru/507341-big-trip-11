import API from './api.js';
import FilterController from './controllers/filter-controller.js';
import MenuComponent from './components/menu.js';
import StatsComponent from './components/stats.js';
import TripDaysComponent from './components/trip-days.js';
import TripController from './controllers/trip-controller.js';
import TripMainInfoComponent from './components/trip-main-info.js';
import TripPointsLoadind from './components/trip-points-loading.js';
import PointsModel from './models/points.js';
import {renderElement, RenderPosition, remove} from './utils/render.js';
import {MenuItem, MENU_ITEMS, FilterType, SortType} from './const.js';

const api = new API();
const pointsModel = new PointsModel();

const headerElement = document.querySelector(`.trip-main`);
const menuElement = document.querySelector(`.trip-controls`);
const eventElement = document.querySelector(`.trip-events`);

const menuComponent = new MenuComponent(MENU_ITEMS);
const tripDaysComponent = new TripDaysComponent();
const filterController = new FilterController(menuElement, pointsModel);
const statsComponent = new StatsComponent(pointsModel);
const tripController = new TripController(tripDaysComponent, pointsModel, api, filterController);
let tripPointsLoading = new TripPointsLoadind();

renderElement(menuElement, menuComponent);
renderElement(eventElement, tripDaysComponent);
renderElement(headerElement, new TripMainInfoComponent(), RenderPosition.AFTERBEGIN);
renderElement(eventElement, statsComponent, RenderPosition.BEFOREEND);
renderElement(eventElement, tripPointsLoading);

statsComponent.hide();

const newPointElement = document.querySelector(`.trip-main__event-add-btn`);
newPointElement.disabled = true;
newPointElement.addEventListener(`click`, () => {
  if (statsComponent) {
    statsComponent.hide();
    tripController.show();
  }
  menuComponent.setSelectedItem(MenuItem.TABLE);
  filterController._onFilterChange(FilterType.EVERYTHING);
  tripController._sortPoints(SortType.DEFAULT);
  tripController.createPoint();
});

menuComponent.setChangeHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      menuComponent.setSelectedItem(MenuItem.TABLE);
      statsComponent.hide();
      tripController.show();
      if (tripPointsLoading && tripController._noWaypointComponent) {
        remove(tripController._noWaypointComponent);
        renderElement(eventElement, tripPointsLoading);
      }
      break;
    case MenuItem.STATS:
      menuComponent.setSelectedItem(MenuItem.STATS);
      statsComponent.show();
      tripController.hide();
      if (tripPointsLoading) {
        remove(tripPointsLoading);
      }
      break;
  }
});

Promise.all([
  api.getPoints(),
  api.getOffers(),
  api.getDestinations()
]).then(([points, offers, destinations]) => {
  pointsModel.setPoints(points);
  pointsModel.setOffers(offers);
  pointsModel.setDestinations(destinations);
  remove(tripPointsLoading);
  tripPointsLoading = null;
  tripController.render();
  filterController.render();
  newPointElement.disabled = false;
});
