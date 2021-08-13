import Group from './Group';
import Button from './Button';

interface CompoundedComponent {
    Group: typeof Group;
    Option: typeof Button;
}

const Scale = {
    Group: Group,
    Option: Button,
} as CompoundedComponent;

export { Group, Button };

export default Scale;
