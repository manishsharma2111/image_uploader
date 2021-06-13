import DropzoneComponent from './DropZone';
import { Formik } from 'formik';
import PlaceHolder from './atom/placeHolder';

function App() {
    return (
        <div className='App'>
            <>
                <Formik
                    initialValues={{ image: '' }}
                    onSubmit={() => {
                        console.log('yes');
                    }}
                >
                    {() => {
                        return (
                            <div>
                                <DropzoneComponent
                                    name='image'
                                    Placeholder={PlaceHolder}
                                />
                                ;
                            </div>
                        );
                    }}
                </Formik>
                {/* <DropzoneComponent /> */}
            </>
        </div>
    );
}

export default App;
