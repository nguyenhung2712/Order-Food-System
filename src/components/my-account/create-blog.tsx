import { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import Image from '@components/ui/image';
import Input from '@components/ui/form/input';
import PasswordInput from '@components/ui/form/password-input';
import Button from '@components/ui/button';
import Heading from '@components/ui/heading';
import { useForm, Controller } from 'react-hook-form';
import { Customer } from '@framework/types';
import { useTranslation } from 'next-i18next';
import Switch from '@components/ui/switch';
import Text from '@components/ui/text';
import { Editor } from '@tinymce/tinymce-react';
import CameraIcon from '@components/icons/camera-icon';
import { RadioBox } from '@components/ui/radiobox';
import {
  CreateBlogInputType,
  useCreateBlogMutation,
} from '@framework/blog/create-blog';
import swal from 'sweetalert';
import { useRouter } from 'next/router';

const defaultValues = {};

const CreateBlog: React.FC = () => {
  const router = useRouter();
  const editorRef = useRef<any>();
  const [content, setContent] = useState<string>();
  const [isHasContent, setIsHasContent] = useState<boolean>(false);
  const [user, setUser] = useState<Customer>();
  const { mutate: createBlog, isLoading } = useCreateBlogMutation();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
  } = useForm<CreateBlogInputType>({
    defaultValues,
  });

  useEffect(() => {
    try {
      let userCookie: string = Cookies.get('user')!;
      setUser(JSON.parse(userCookie));
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error('Invalid JSON:', error.message);
      } else {
        throw error;
      }
    }
  }, []);

  function onSubmit(input: CreateBlogInputType) {
    if (isHasContent) {
      editorRef.current.uploadImages();
      createBlog({ content: content, header: input.header, userId: user?.id });
    } else {
      return;
    }
  }

  const handleEditorChange = (e: any) => {
    if (editorRef.current.getContent() === '') {
      setIsHasContent(false);
      return;
    }
    setIsHasContent(true);
    setContent(editorRef.current.getContent());
  };

  return (
    <div className="w-full flex flex-col">
      <Heading variant="titleLarge" className="mb-5 md:mb-6 lg:mb-7 lg:-mt-1">
        {t('common:text-create-blog')}
      </Heading>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-auto flex flex-col justify-center"
        noValidate
      >
        <div className="border-skin-base border-b pb-7 md:pb-8 lg:pb-10">
          <div className="flex flex-col space-y-4 sm:space-y-5">
            <div className="flex flex-col sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
              <Input
                label={t('forms:label-blog-header')}
                {...register('header', {
                  required: 'forms:first-name-required',
                })}
                variant="solid"
                className="w-full px-1.5 md:px-2.5"
                error={errors.header?.message}
              />
            </div>
            <div className="flex flex-col -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
              <div className="w-full px-1.5 md:px-2.5">
                <label className="block font-normal text-sm leading-none mb-3 cursor-pointer text-skin-base text-opacity-70">
                  {t('forms:label-blog-content')}
                </label>
                <Editor
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  /* value={id && state.content} */
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                      'advlist',
                      'anchor',
                      'autolink',
                      'help',
                      'image',
                      'code',
                      'link',
                      'lists',
                      'searchreplace',
                      'table',
                      'wordcount',
                    ],
                    toolbar:
                      'undo redo | blocks fontfamily fontsize | ' +
                      'bold italic underline strikethrough | image link | ' +
                      'mergetags | addcomment showcomments | spellcheckdialog ' +
                      'a11ycheck typography | align lineheight | checklist numlist ' +
                      'bullist indent outdent | emoticons charmap | removeformat',
                    file_picker_types: 'image media',
                    image_title: true,
                    automatic_uploads: false,
                    file_picker_callback: function (cb, value, meta) {
                      var input = document.createElement('input');
                      input.setAttribute('type', 'file');
                      input.setAttribute('accept', 'image/*');

                      input.onchange = function () {
                        var file = input.files![0];

                        var reader = new FileReader();
                        reader.onload = function () {
                          var id = 'blobid' + new Date().getTime();
                          var blobCache =
                            editorRef.current.editorUpload.blobCache;
                          var base64 = (reader.result as string)?.split(',')[1];
                          var blobInfo = blobCache.create(id, file, base64);
                          blobCache.add(blobInfo);

                          cb(blobInfo.blobUri(), { title: file.name });
                        };
                        reader.readAsDataURL(file);
                      };

                      input.click();
                    },
                    images_upload_url:
                      'http://localhost:5000/api/blog/upload-image',
                    content_style:
                      'body { font-family:Tahoma,Arial,sans-serif; font-size:14px }',
                    branding: false,
                  }}
                  onEditorChange={handleEditorChange}
                />
                {!isHasContent && (
                  <p className="my-2 text-13px text-skin-red text-opacity-70">
                    Content is required
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="relative flex sm:ms-auto mt-5 pb-2 lg:pb-0">
          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading}
            variant="formButton"
            className="w-full sm:w-auto"
          >
            {t('common:button-save-changes')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
