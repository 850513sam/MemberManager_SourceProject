/* eslint-disable class-methods-use-this */
import LoadingTask from './LoadingTask';

export default class CompositeLoadingTask extends LoadingTask {
    private subTasks: LoadingTask[] = [];
    private waitForTaskAddedCallbacks: { [taskName: string]: ((task: LoadingTask) => void)[] } = {};

    public findTask(taskName: string) {
        return this.subTasks.find((task) => task.name === taskName);
    }

    public waitForTaskAdded(taskName: string): Promise<LoadingTask> {
        const existTask = this.subTasks.find((task) => taskName === task.name);
        if (existTask) {
            return Promise.resolve(existTask);
        }
        const callbacks = this.waitForTaskAddedCallbacks[taskName] ?? (this.waitForTaskAddedCallbacks[taskName] = []);
        return new Promise<LoadingTask>((resolve) => {
            callbacks.push(resolve);
        });
    }

    public async addSimpleTask<T>(task: string, taskPromise: Promise<T>): Promise<T> {
        const subTask = this.addTask(task);
        subTask.progress(0, 1);
        try {
            const data = await taskPromise;
            subTask.progress(1, 1);
            subTask.finish(null);
            return data;
        } catch (reason) {
            if (reason instanceof Error) {
                subTask.finish(reason);
            } else if (typeof reason === 'string') {
                subTask.finish(new Error(reason));
            } else {
                subTask.finish(new Error(`LoadingTask: ${subTask.name} Failed, reason: ${reason}`));
            }
            return null;
        }
    }

    public addTask(task: string | LoadingTask): LoadingTask {
        const subTask = task instanceof LoadingTask ? task : new LoadingTask(task);
        if (this.subTasks.find((each) => each.name === subTask.name)) {
            throw new Error(`There is task named ${subTask.name} in the group already`);
        }
        subTask.on('onProgress', this.onSubTaskProgress, this);
        subTask.on('onFinished', this.onSubTaskFinished, this);
        if (subTask.completeCount) {
            this.onSubTaskProgress();
        }
        this.subTasks.push(subTask);
        this.waitForTaskAddedCallbacks[subTask.name]?.forEach((callback) => callback(subTask));
        return subTask;
    }

    public progress(): void {
        throw new Error('TaskGroup shoud not progress by itself');
    }

    public finish(): void {
        throw new Error('TaskGroup shoud not finish by itself');
    }

    private onSubTaskProgress() {
        super.progress(
            this.subTasks.reduce((pre, cur) => pre + cur.completeCount, 0),
            this.subTasks.reduce((pre, cur) => pre + cur.totalCount, 0)
        );
    }

    private onSubTaskFinished() {
        if (this.subTasks.every((task) => task.isFinished)) {
            super.finish(
                this.subTasks.every((task) => task.isSuccess)
                    ? null
                    : new Error(`Status: ${this.subTasks.filter((subTask) => !subTask.isSuccess).length}/${this.subTasks.length} Tasks failed`)
            );
        }
    }
}
