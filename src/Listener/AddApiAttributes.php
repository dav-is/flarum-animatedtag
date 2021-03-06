<?php namespace davis\animatedtag\Listener;

use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Event\PrepareApiAttributes;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;

class AddApiAttributes
{
    protected $settings;

  public function __construct(SettingsRepositoryInterface $settings) {
    $this->settings = $settings;
  }

  public function subscribe(Dispatcher $events) {
    $events->listen(PrepareApiAttributes::class, [$this, 'prepareApiAttributes']);
  }

  public function prepareApiAttributes(PrepareApiAttributes $event) {
    if ($event->isSerializer(ForumSerializer::class)) {
      $event->attributes['animationtype'] = $this->settings->get('davis.animatedtag.animationtype');
    }
  }
}
