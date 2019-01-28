//import QueryParams from './queryParams';

export default class Events {
   constructor($el){
       this.$el = $el;
       this.logging = false;

       //if ( window.location.hostname === 'localhost' || QueryParams().logging ){
       if ( window.location.hostname === 'localhost' ){
           this.logging = true;
       }
   }

   log(method,message,payload){
       if ( this.logging ){
           console.log('[LOG]',method,'[Message]',message,
                       '\n[LOG]',method,'[Payload]',payload);
       }
   }

   pub(event,detail){
       if ( event !== undefined ){
           this.log('[Pub]',event,detail);
           if (this.$el) {
               this.$el.dispatchEvent(new CustomEvent(event,{ bubbles: true, detail }));
           }
           else {
               this.log('[Pub]','Not executed, $el is null',event,detail);
           }
       } else {
           this.log('[Pub]','Not executed, no event name passed',event,detail);
       }
   }

   sub(event,callback){
       if ( event !== undefined && callback !== undefined ){
           this.log('[Sub]',event);
           this.$el.addEventListener(event,callback);
       } else {
           this.log('[Sub]', 'Subscription not registered, no event name passed',event);
       }
   }
}