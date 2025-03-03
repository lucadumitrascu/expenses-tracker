import styles from "./Authentication.module.css";

function ProgressBar(props) {
    const percentage = (props.step / props.totalSteps) * 100;

    return (
        <div className={styles["progress-bar-container"]}>
            <div className={styles["progress-bar-div"]}>
                <div className={styles["progress-bar"]} style={{ width: `${percentage}%` }}></div>
            </div>
            <p className={styles["progress-text"]}>
                Step {props.step} of {props.totalSteps}
            </p>
        </div>
    );
}

export default ProgressBar;
