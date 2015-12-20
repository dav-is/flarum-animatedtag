import SettingsModal from 'flarum/components/SettingsModal';

export default class AnimatedTagSettingsModal extends SettingsModal {
  className() {
    return 'AnimatedTagSettingsModal Modal--small';
  }

  title() {
    return 'Animated Tag Settings';
  }

  form() {
    return [
      <div className="Form-group">
        <label>Limit Number of Websites</label>
        <input className="FormControl" bidi={this.setting('davis.animatedtag.limit')}/>
      </div>
    ];
  }
}
