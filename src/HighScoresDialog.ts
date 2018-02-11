export default class HighScoresDialog {
  constructor() {
    /*let dialog: JQuery<HTMLElement> = $('#dialog-form').dialog({
      autoOpen: false,
      height: 400,
      width: 350,
      modal: true,
      buttons: {
        'Create an account': this.publishScore.bind(this),
        Cancel: function() {
          dialog.dialog('close');
        }
      },
      close: function() {
        console.log('closing dialog');
        // form[0].reset();
        // allFields.removeClass('ui-state-error');
      }
    });
    dialog.dialog('open');*/
  }

  /**
   * Public methods
   */

  /**
   * Private methods
   */
  private publishScore(): void {
    console.log('Publishing score...');
  }

  /**
   * Private members
   */
}
