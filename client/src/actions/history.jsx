export const VISIT_EDIT_VIEW_PAGE = 'VISIT_EDIT_VIEW_PAGE';
export function visitEditViewPage(id) {
    return {
        type: VISIT_EDIT_VIEW_PAGE,
        id,
    };
}

export const VISIT_EDIT_BLOCK_PAGE = 'VISIT_EDIT_BLOCK_PAGE';
export function visitEditBlockPage(id) {
    return {
        type: VISIT_EDIT_BLOCK_PAGE,
        id,
    };
}
