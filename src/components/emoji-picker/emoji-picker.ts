import { Component, forwardRef } from "@angular/core";
import { EmojiProvider } from "../../providers/emoji";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

export const EMOJI_PICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => EmojiPickerComponent),
  multi: true
};

@Component({
  selector: "emoji-picker",
  providers: [EMOJI_PICKER_VALUE_ACCESSOR],
  templateUrl: "./emoji-picker.html"
})
export class EmojiPickerComponent implements ControlValueAccessor {
  emojiArr = [];
  faceArr = [];
  baloonArr = [];
  foodArr = [];
  carArr = [];
  heartArr = [];
  historyArr = [];
  selected = 'emoji';

  _content: string;
  _onChanged: Function;
  _onTouched: Function;

  constructor(emojiProvider: EmojiProvider) {
    this.emojiArr = emojiProvider.getSmiles();
    this.faceArr = emojiProvider.getFaces();
    this.foodArr = emojiProvider.getFoods();
    this.baloonArr = emojiProvider.getBaloons();
    this.carArr = emojiProvider.getCars();
    this.heartArr = emojiProvider.getHeart();
  }

  setSelected(selected: string) {
    this.selected = selected;
  }

  addHitory(item) {
    if (null === item) return;
    // if (this.historyArr.length >= 24) this.historyArr = [];
    if (this.historyArr.indexOf(item) === -1) {
      this.historyArr.push(item);
      // console.log(this.historyArr);
    }
  }

  writeValue(obj: any): void {
    this._content = obj;
  }

  registerOnChange(fn: any): void {
    this._onChanged = fn;
    this.setValue(this._content);
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  private setValue(val: any): any {
    this.addHitory(val);
    this._content += val;
    if (this._content) {
      this._onChanged(this._content);
    }
  }
}
