import { useEffect } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Label from './Label';
import { CalenderIcon } from '../../icons';
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;
import { FieldError } from 'react-hook-form';

type PropsType = {
    id: string;
    mode?: "single" | "multiple" | "range" | "time";
    onChange?: Hook | Hook[];
    defaultDate?: DateOption;
    value?: DateOption;
    label?: string;
    placeholder?: string;
    name?: string;
    error?: FieldError
};

export default function DatePicker({
    id,
    name,
    mode,
    onChange,
    label,
    defaultDate,
    value,
    placeholder,
    error
}: PropsType) {
    useEffect(() => {
        const flatPickr = flatpickr(`#${id}`, {
            mode: mode || "single",
            dateFormat: "Y-m-d",
            static: true,
            monthSelectorType: "static",
            defaultDate: defaultDate || value,
            onChange,
        });
        return () => {
            if (!Array.isArray(flatPickr)) flatPickr.destroy();
        };
    }, [id, mode, defaultDate, onChange]);

    return (
        <div className="mb-4">
            {label && <Label htmlFor={id} className="text-sm">{label}</Label>}
            <div className="relative">
                <input
                    name={name}
                    id={id}
                    placeholder={placeholder}
                    className={`h-11 w-full rounded-lg border px-4 py-2.5 text-sm
            ${error
                            ? "border-error-500 focus:ring-error-500/20"
                            : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/10"}`}
                />
                <span className="absolute text-gray-500 right-3 top-1/2 -translate-y-1/2">
                    <CalenderIcon className="size-6" />
                </span>
            </div>
            {error && <p className="text-sm text-error-500 mt-1">{error.message}</p>}
        </div>
    );
}


// export default function DatePicker({
//     id,
//     mode,
//     onChange,
//     label,
//     defaultDate,
//     placeholder,
//     name
// }: PropsType) {
//     useEffect(() => {
//         const flatPickr = flatpickr(`#${id}`, {
//             mode: mode || "single",
//             static: true,
//             monthSelectorType: "static",
//             dateFormat: "Y-m-d",
//             defaultDate,
//             onChange,
//         });

//         return () => {
//             if (!Array.isArray(flatPickr)) {
//                 flatPickr.destroy();
//             }
//         };
//     }, [mode, onChange, id, defaultDate]);

//     return (
//         <div>
//             {label && <Label htmlFor={id} className='text-sm'>{label}</Label>}

//             <div className="relative">
//                 <input
//                     name={name}
//                     id={id}
//                     placeholder={placeholder}
//                     className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
//                 />

//                 <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
//                     <CalenderIcon className="size-6" />
//                 </span>
//             </div>
//         </div>
//     );
// }

