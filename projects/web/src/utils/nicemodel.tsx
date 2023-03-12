import NiceModal, { useModal } from "@ebay/nice-modal-react";

interface ModalInjection<Return> {
  props: {
    visible: boolean;
    afterClose: () => void;
    onCancel: () => void;
  };
  resolve: (r: Return) => void;
  reject: (e?: Error) => void;
}

export const createNiceModal = <Props extends {}, Return extends any>(
  Comp: React.ComponentType<Props & { _modal: ModalInjection<Return> }>
) => {
  const CompWrapper: React.FC<Props> = (props) => {
    const modal = useModal();
    const _modal: ModalInjection<Return> = {
      props: {
        visible: modal.visible,
        afterClose: modal.remove,
        onCancel: () => {
          modal.reject();
          modal.hide();
        },
      },
      resolve: (r: Return) => {
        modal.resolve(r);
        modal.hide();
      },
      reject: (e?: Error) => {
        modal.reject(e);
        modal.hide();
      },
    };
    return <Comp {...props} _modal={_modal} />;
  };
  const Modal = NiceModal.create(CompWrapper);
  return async (props: Props): Promise<Return> => {
    return await NiceModal.show(Modal, props as any);
  };
};
