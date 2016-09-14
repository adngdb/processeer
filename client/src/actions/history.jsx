export const VISIT_EDIT_VIEW_PAGE = 'VISIT_EDIT_VIEW_PAGE';
export function visitEditViewPage(id) {
    return {
        type: VISIT_EDIT_VIEW_PAGE,
        id,
    };
}

export const VISIT_EDIT_REPORT_PAGE = 'VISIT_EDIT_REPORT_PAGE';
export function visitEditReportPage(id) {
    return {
        type: VISIT_EDIT_REPORT_PAGE,
        id,
    };
}
