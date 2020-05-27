import FilterComponent from "../components/filter.js";
import {FilterType} from "../const.js";
import {renderElement, replaceElement} from "../utils/render.js";

export default class FilterController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._activeFilterType = FilterType.EVERYTHING;
    this._filterComponent = null;
    this._onFilterChange = this._onFilterChange.bind(this);
  }

  render() {
    const container = this._container;
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        checked: filterType === this._activeFilterType,
        disabled: this._pointsModel.getPoints(filterType).length === 0
      };
    });
    const oldComponent = this._filterComponent;
    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);
    if (oldComponent) {
      replaceElement(this._filterComponent, oldComponent);
    } else {
      renderElement(container, this._filterComponent);
    }
  }

  _onFilterChange(filterType) {
    this._activeFilterType = filterType;
    this._pointsModel.setFilter(filterType);
  }
}
