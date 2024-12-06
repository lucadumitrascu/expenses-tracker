import '../../styles/auth.css';

function ProgressBar(props) {
    const percentage = (props.step / props.totalSteps) * 100;

    return (
        <div className="progress-bar-container">
            <div className="progress-bar-div">
                <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
            </div>
            <p className="progress-text">
                Step {props.step} of {props.totalSteps}
            </p>
        </div>
    );
}

export default ProgressBar;