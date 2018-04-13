import {
    IncomingSocketNames,
    OutgoingSocketEvent
} from "./SocketNS";
import { getElementData } from "./browser.utils";
import { Observable } from "rxjs/Observable";
import { createTimedBooleanSwitch } from "./utils";
import * as KeyupEvent from './messages/KeyupEvent';

export function getFormInputStream(
    document: Document,
    socket$
): Observable<OutgoingSocketEvent> {
    const canSync$ = createTimedBooleanSwitch(
        socket$.filter(([name]) => name === IncomingSocketNames.Keyup)
    );
    return inputObservable(document)
        .withLatestFrom(canSync$)
        .filter(([, canSync]) => canSync)
        .map((incoming): OutgoingSocketEvent => {
            const keyupEvent: { target: HTMLInputElement } = incoming[0];
            const target = getElementData(keyupEvent.target);
            const value = keyupEvent.target.value;

            return KeyupEvent.outgoing(target, value);
        });
}

function inputObservable(document: Document) {
    return Observable.create(obs => {
        document.body.addEventListener(
            "keyup",
            function(event) {
                const elem = <HTMLInputElement>(event.target ||
                    event.srcElement);
                if (elem.tagName === "INPUT" || elem.tagName === "TEXTAREA") {
                    obs.next({ target: event.target });
                }
            },
            true
        );
    }).share();
}
