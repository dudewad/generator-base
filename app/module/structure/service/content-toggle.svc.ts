import { Injectable } from '@angular/core';
import { ContentToggle_Cmp } from "../component";

@Injectable()
export class ContentToggle_Svc {
  private toggles: ContentToggle_Cmp[] = [];

  public register(toggle: ContentToggle_Cmp) {
    this.toggles.push(toggle);
  }

  public unregister(toggle: ContentToggle_Cmp) {
    this.toggles.splice(this.toggles.indexOf(toggle), 1);
  }

  public onToggleHide(srcToggle: ContentToggle_Cmp, target: string) {
    const toggle = this.findToggleById(target);
    const toggleId = toggle && toggle.getId();

    if (toggleId && toggleId !== srcToggle.getId()) {
      toggle.onHide();
    }
  }

  private findToggleById(id) {
    return this.toggles.find(toggle => toggle.getId() === id);
  }
}