import {IncomingSocketNames} from "../lib/SocketNS";

export type FileReloadEventPayload = {
    url?: string;
    ext: string;
    path: string;
    basename: string;
    event: string;
    type: 'inject' | 'reload';
}

export type FileReloadEvent = [IncomingSocketNames.FileReload, FileReloadEventPayload];
