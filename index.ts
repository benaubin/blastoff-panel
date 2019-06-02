import logUpdate from "log-update";

export interface TaskStatus {
  name: string;
  status: "complete" | "starting" | "pending";
}

export interface StatusProps {
  serviceName: string;
  readyMessage?: string;
}

export interface StatusMessages {
  withStatus<T>(name: string, f: (() => Promise<T>)): () => Promise<T>;
}

export default function statusMessages({serviceName, readyMessage}: StatusProps): StatusMessages {
  let statuses: TaskStatus[] = [];
  let statusUpdateInterval: NodeJS.Timeout | undefined;

  function startStatusUpdates(): void {
    if(statusUpdateInterval) return;

    let frameN = 0;
    const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    
    statusUpdateInterval = setInterval(() => {
      const frame = frames[++frameN % frames.length];
    
      let allComplete: boolean | null = null;
    
      const statusLog = statuses.map((status) => {
        switch (status.status) {
          case "complete":
            if(allComplete !== false) allComplete = true;
            return `   ✅  ${status.name} ready!`;
          case "starting":
            allComplete = false;
            return `   ${frame}  ${status.name} starting...`;
          case "pending":
            allComplete = false;
            return `   ◯  ${status.name}`;
        }
      }).join("\n");
    
      if(allComplete) {
        clearInterval(statusUpdateInterval!); //eslint-disable-line
        statusUpdateInterval = undefined;

        logUpdate(`🚀   ${serviceName} ${readyMessage}\n${statusLog}`);
        logUpdate.done();
        statuses = [];
      } else {
        logUpdate(`
${serviceName} starting up...
${statusLog}`);
      }
    }, 80);
  }

  function withStatus<T>(name: string, f: (() => Promise<T>)): () => Promise<T> {
    let status: TaskStatus = {name, status: "pending"};
    statuses.push(status);
    startStatusUpdates();

    return async () => {
      if(statuses.indexOf(status) == -1) {
        statuses.push(status);
        startStatusUpdates();
      }

      status.status = "starting";
      const result = await f();
      status.status = "complete";
      return result;
    };
  };

  return {withStatus};
};