export const VISIT_EDIT_REPORT_PAGE = 'VISIT_EDIT_REPORT_PAGE';
export function visitEditReportPage(id) {
    return {
        type: VISIT_EDIT_REPORT_PAGE,
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
